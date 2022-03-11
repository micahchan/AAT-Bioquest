import express from "express";
import { RowDataPacket } from "mysql2";
import Compound from "../../../lib/Compounds";
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
    console.log("The dataset about to be submittied is: " + JSON.stringify(req.body, null, 4));

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

        //console.log("The sql statement is: " + comp_sql);
        //console.log("The paramsArr is:" + JSON.stringify(paramsArr, null, 4));

        const [comp_row] = await _db.query<Array<RowType>>(comp_sql, paramsArr);

        /*
                const comp_sql = "SELECT uID, cID, depth1 FROM www.compounds_depth WHERE depth1 IN ('mw', 'name') AND cID = ?";
        
                const comp_params: any = [];
                const marks: any = [];
                let updateCompounds: boolean = false;
                for (let i = 0; i < req.body.compounds.length; i++) {
                    let nameFlag: boolean = false;
                    let mwFlag: boolean = false;
                    let missingArr = [];
                    const [comp_row] = await _db.query<Array<RowType>>(comp_sql, [req.body.compounds[i].cID]);
                    for (let j = 0; comp_row && j < comp_row.length; j++) {
                        if (comp_row[j].depth1 === "name") { nameFlag = true; }
                        if (comp_row[j].depth1 === "mw") { mwFlag = true; }
                    }
                    if (!nameFlag) { missingArr.push("name"); }
                    if (!mwFlag) { missingArr.push("mw"); }
                    for (let k = 0; k < missingArr.length; k++) {
                        marks.push("(?, ?, ?)");
                        comp_params.push(req.body.compounds[i].cID);
                        comp_params.push(missingArr[k]);
                        comp_params.push(req.body.compounds[i][missingArr[k]]);
                        updateCompounds = true;
                    }
                }
                
                if (updateCompounds === true) {
                    const comp_insert_sql = `INSERT INTO www.compounds_depth (cID, depth1, value) VALUES ${marks.join(',')}`;
                    console.log("The crafted sql statement is: " + comp_insert_sql);
                    //comp_insert_sql += marks.join(", ");
                    const [insert_comp_row] = await _db.query<Array<RowType>>(comp_insert_sql, comp_params);
                }
        */
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

        let compounds: any = [];
        if (comp_row !== null) {
            for (let i = 0; i < comp_row.length; i++) {
                let compoundData = comp_row[i];
                if (compounds.some((obj: any) => obj.cID === compoundData.cID) === false) { compounds.push(compoundData); }
            }
        }

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