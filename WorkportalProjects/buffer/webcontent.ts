import express from "express";
import { RowDataPacket } from "mysql2";
import { WorkPortalApp } from "src/types/Index";
import { Res } from "../lib/response";
import { _db } from "../lib/sql";

export const Webcontent = express.Router();

//@ts-ignore
Webcontent.post('/buffer/submit-buffer', async (req, res) => {
    const r = new Res(res);
    interface RowType extends RowDataPacket, WorkPortalApp { };
    try {
        const sql =
            `INSERT INTO www.formula_data (formula_id, title, type, components, attributes) VALUES (?, ?, 'buffer', ?, ?) ON DUPLICATE KEY UPDATE components = ?, attributes = ?`;
        const [data_row] = await _db.query<Array<RowType>>(sql, [req.body.formula_id, req.body.title, req.body.components, req.body.attributes, req.body.components, req.body.attributes]);

        const comp_sql = `SELECT uID FROM www.compounds_depth WHERE depth1 IN ('mw', 'name') AND cID = ?`;
        const comp_insert_sql = `INSERT INTO www.compounds_depth (cID, depth1, value, oID) VALUES (?, 'mw', ?, ''), (?, 'name', ?, '')`;


        for (let i = 0; i < req.body.compounds.length; i++) {
            const [comp_row] = await _db.query<Array<RowType>>(comp_sql, [req.body.compounds[i].cID]);
            //console.log("comp_row is: " + JSON.stringify(comp_row, null, 4));
            if (!comp_row || comp_row.length === 0) {
                //console.log("Inserting here: " + req.body.compounds[i].name);
                const [insert_comp_row] = await _db.query<Array<RowType>>(comp_insert_sql, [req.body.compounds[i].cID, req.body.compounds[i].mw, req.body.compounds[i].cID, req.body.compounds[i].name]);
            }
        }

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
Webcontent.post('/buffer/get-buffer-list', async (req, res) => {
    const r = new Res(res);
    interface RowType extends RowDataPacket, WorkPortalApp { };
    try {
        const sql = `SELECT formula_id, title FROM www.formula_data WHERE type='buffer'`;
        const [data_row] = await _db.query<Array<RowType>>(sql);

        if (!data_row || data_row.length === 0) { throw 'Missing data'; }
        //console.log(data_row);
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
Webcontent.post('/buffer/get-buffer-info', async (req, res) => {
    const r = new Res(res);
    interface RowType extends RowDataPacket, WorkPortalApp { };
    try {
        const sql = `SELECT formula_id, components, attributes FROM www.formula_data WHERE type='buffer' AND formula_id = ?`;
        const [data_row] = await _db.query<Array<RowType>>(sql, [req.body.id]);
        //console.log("The data_row results are: " + JSON.stringify(data_row, null, 4));

        const cIDarr: any = [];
        const marks: any = [];
        if (data_row !== null) {
            for (let i = 0; i < data_row[0].components.length; i++) {
                let compCID = data_row[0].components[i].cID;
                cIDarr.push(compCID);
                marks.push('?');
            }
        }

        let comp_sql = `SELECT c1.cID, c1.value as mw, c2.value as name FROM www.compounds_depth as c1 INNER JOIN www.compounds_depth as c2 ON c1.cID = c2.cID WHERE c1.depth1 = 'mw' AND c2.depth1 = 'name' AND c1.cID IN (`;
        comp_sql += marks.join(",") + `)`;
        const [comp_row] = await _db.query<Array<RowType>>(comp_sql, cIDarr);

        let compounds: any = [];
        if (comp_row !== null) {
            for (let i = 0; i < comp_row.length; i++) {
                let compoundData = comp_row[i];
                if (compounds.some((obj: any) => obj.cID === compoundData.cID) === false) { compounds.push(compoundData); }
            }
        }

        //console.log("The sorting array, cIDarr: " + JSON.stringify(cIDarr, null, 4));
        let sortCompounds: any = [];
        sortCompounds = compounds.sort(function (a: any, b: any) {
            return cIDarr.indexOf(a.cID) - cIDarr.indexOf(b.cID);
        });
        //console.log("sortCompounds is: " + JSON.stringify(sortCompounds, null, 4));

        if (data_row !== null) { data_row[0]["compounds"] = sortCompounds; }

        if (!data_row || data_row.length === 0) { throw 'Missing data'; }
        console.log("The final dataset is: " + JSON.stringify(data_row, null, 4));
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
Webcontent.post('/buffer/get-compounds-info', async (req, res) => {
    const r = new Res(res);
    interface RowType extends RowDataPacket, WorkPortalApp { };
    try {
        const comp_sql = `SELECT value as mw FROM www.compounds_depth WHERE cID = ? AND depth1 ='mw'`;
        const [data_row] = await _db.query<Array<RowType>>(comp_sql, [req.body.compoundID]);

        if (!data_row || data_row.length === 0) { throw 'Missing data'; }
        //console.log(data_row);
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