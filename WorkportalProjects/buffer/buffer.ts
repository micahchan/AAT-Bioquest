import express from "express";
import { RowDataPacket } from "mysql2";
import Compound from "../../../lib/compounds";
import { WorkPortalApp } from "../../../types/Index";
import { Res } from "../../lib/response";
import { _db } from "../../lib/sql";

export const Buffer = express.Router();

const linearLeastSquares = (data: any,) => {
    const count = data.attributes.phArr.length;
    let sum_x = 0;
    let sum_y = 0;
    let sum_xx = 0;
    let sum_xy = 0;
    for (let i = 0; i < data.attributes.phArr.length; i++) {
        const x = data.attributes.phArr[i].pH;
        const y = data.attributes.phArr[i].amount;
        sum_x += parseFloat(x);
        sum_y += parseFloat(y);
        sum_xx += (x * x);
        sum_xy += (x * y);
    }
    const m = (count * sum_xy - sum_x * sum_y) / (count * sum_xx - sum_x * sum_x);
    const b = (sum_y - m * sum_x) / count;
    const og_denom = parseFloat(data.attributes.phArr[0].amount) + parseFloat(data.attributes.phArr[0].conjAmount);

    data.attributes.variable_data.m = m;
    data.attributes.variable_data.b = b;
    data.attributes.variable_data.og_denom = og_denom;
};

//@ts-ignore
Buffer.post('/submit-buffer', async (req, res) => {
    const r = new Res(res);
    interface RowType extends RowDataPacket, WorkPortalApp { };

    if (req.body.attributes.phArr && req.body.attributes.phArr.length >= 2) {
        linearLeastSquares(req.body);
    }
    try {
        const sql =
            "INSERT INTO www.formula_data (formula_id, title, type, components, attributes) VALUES (?, ?, 'buffer', ?, ?) ON DUPLICATE KEY UPDATE components = ?, attributes = ?";
        const [data_row] = await _db.query<Array<RowType>>(sql, [req.body.formula_id, req.body.title, req.body.components, req.body.attributes, req.body.components, req.body.attributes]);

        const rowsToAdd: any = [];
        for (let i = 0; i < req.body.compounds.length; i++) {
            const param: any = {};
            param.mw = req.body.compounds[i].mw;
            param.name = req.body.compounds[i].name;
            const depth_rows = Compound.toSQL(req.body.compounds[i].cID, param);
            rowsToAdd.push.apply(rowsToAdd, depth_rows);
        }

        const paramsArr: any = [];
        const marks: any = [];
        for (let i = 0; i < rowsToAdd.length; i++) {
            paramsArr.push(rowsToAdd[i].cID);
            paramsArr.push(rowsToAdd[i].value);
            paramsArr.push(rowsToAdd[i].depth1);
            paramsArr.push(rowsToAdd[i].depth2);
            paramsArr.push(rowsToAdd[i].depth3);
            paramsArr.push(rowsToAdd[i].depth4);
            paramsArr.push(rowsToAdd[i].depth5);
            paramsArr.push(rowsToAdd[i].hash);
            marks.push("(?, ?, ?, ?, ?, ?, ?, ?)");
        }

        const comp_sql = `INSERT IGNORE INTO www.compounds_depth (cID, value, depth1, depth2, depth3, depth4, depth5, hash) VALUES ${marks.join(', ')}`;

        const [comp_row] = await _db.query<Array<RowType>>(comp_sql, paramsArr);

        if (!data_row || data_row.length === 0) { throw 'Missing data'; }

        r.data = data_row;
        r.code = 200;
        r.json(); //send response back to use

        return;
    }
    catch (e) {
        console.log(e);
        r.code = 500;
        return r.json();
    }
});

//@ts-ignore
Buffer.post('/get-buffer-list', async (req, res) => {
    const r = new Res(res);
    interface RowType extends RowDataPacket, WorkPortalApp { };
    try {
        const sql = "SELECT formula_id, title FROM www.formula_data WHERE type='buffer'";
        const [data_row] = await _db.query<Array<RowType>>(sql);

        if (!data_row || data_row.length === 0) { throw 'Missing data'; }
        r.data = data_row;
        r.code = 200;
        r.json(); //send response back to use

        return;
    }
    catch (e) {
        console.log(e);
        r.code = 500;
        return r.json();
    }
});

//@ts-ignore
Buffer.post('/get-buffer-info', async (req, res) => {
    const r = new Res(res);
    interface RowType extends RowDataPacket, WorkPortalApp { };
    try {
        const sql = "SELECT formula_id, components, attributes FROM www.formula_data WHERE type='buffer' AND formula_id = ?";
        const [data_row] = await _db.query<Array<RowType>>(sql, [req.body.id]);

        console.log("Test of db pull, data_row is: " + JSON.stringify(data_row, null, 4));

        const cIDarr: any = [];
        const marks: any = [];
        if (data_row !== null) {
            for (let i = 0; i < data_row[0].components.length; i++) {
                let compCID = data_row[0].components[i].cID;
                cIDarr.push(compCID);
                marks.push('?');
            }
        }

        const comp_sql = `SELECT c1.cID, c1.value as mw, c2.value as name FROM www.compounds_depth as c1 INNER JOIN www.compounds_depth as c2 ON c1.cID = c2.cID WHERE c1.depth1 = 'mw' AND c2.depth1 = 'name' AND c1.cID IN (${marks.join(', ')})`;
        const [comp_row] = await _db.query<Array<RowType>>(comp_sql, cIDarr);

        //Check to make sure no duplicates were pulled from the db. May be obselete with unique index from hashing.
        let compounds: any = [];
        if (comp_row !== null) {
            for (let i = 0; i < comp_row.length; i++) {
                let compoundData = comp_row[i];
                if (compounds.some((obj: any) => obj.cID === compoundData.cID) === false) { compounds.push(compoundData); }
            }
        }

        //Orders the compounds to be the same as components after being pulled from the db
        let sortCompounds: any = [];
        sortCompounds = compounds.sort(function (a: any, b: any) {
            return cIDarr.indexOf(a.cID) - cIDarr.indexOf(b.cID);
        });

        if (data_row !== null) { data_row[0]["compounds"] = sortCompounds; }

        if (!data_row || data_row.length === 0) { throw 'Missing data'; }
        r.data = data_row;
        r.code = 200;
        r.json(); //send response back to use

        return;
    }
    catch (e) {
        console.log(e);
        r.code = 500;
        return r.json();
    }
});

//@ts-ignore
Buffer.post('/get-compounds-info', async (req, res) => {
    const r = new Res(res);
    interface RowType extends RowDataPacket, WorkPortalApp { };
    try {
        const comp_sql = "SELECT value as mw FROM www.compounds_depth WHERE cID = ? AND depth1 ='mw'";
        const [data_row] = await _db.query<Array<RowType>>(comp_sql, [req.body.compoundID]);

        if (!data_row || data_row.length === 0) { throw 'Missing data'; }
        r.data = data_row;
        r.code = 200;
        r.json(); //send response back to use

        return;
    }
    catch (e) {
        console.log(e);
        r.code = 500;
        return r.json();
    }
});