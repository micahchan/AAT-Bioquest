import express from "express";
import { RowDataPacket } from "mysql2";
import Compound from "../../../lib/compounds";
import { bufferInitialType, bufferPhType } from "../../../types/pages/webcontent/Buffer";
import { Res } from "../../lib/response";
import { _db } from "../../lib/sql";

export const Buffer = express.Router();

const checkEmptyValues = (data: bufferInitialType): boolean => {
    let status = false;
    for (let i = 0; data.attributes.phArr && i < data.attributes.phArr.length; i++) {
        for (const key of Object.keys(data.attributes.phArr[i])) {
            if (data.attributes.phArr[i][key as keyof bufferPhType] === "") {
                // console.log("Tripped in server side script ", key);
                status = true;
                break;
            }
        }
    }
    return status;
};

const linearLeastSquares = (data: bufferInitialType): void => {
    if (data.attributes.phArr && data.attributes.variable_data) {
        const count = data.attributes.phArr.length;
        let sum_x = 0;
        let sum_y = 0;
        let sum_xx = 0;
        let sum_xy = 0;
        for (let i = 0; i < data.attributes.phArr.length; i++) {
            const x = data.attributes.phArr[i].pH;
            const y = data.attributes.phArr[i].amount;
            sum_x += Number(x);
            sum_y += Number(y);
            sum_xx += Number(x) * Number(x);
            sum_xy += Number(x) * Number(y);
        }
        const m = (count * sum_xy - sum_x * sum_y) / (count * sum_xx - sum_x * sum_x);
        const b = (sum_y - m * sum_x) / count;
        const og_denom = Number(data.attributes.phArr[0].amount) + Number(data.attributes.phArr[0].conjAmount);

        data.attributes.variable_data.m = m;
        data.attributes.variable_data.b = b;
        data.attributes.variable_data.og_denom = og_denom;
    }
};

Buffer.post('/submit-buffer', async (req, res) => {
    const r = new Res(res);
    // console.log("The database received data is: ", JSON.stringify(req.body, null, 4));
    if (req.body.attributes.phArr && req.body.attributes.phArr.length >= 2) {
        if (checkEmptyValues(req.body) === false) {
            linearLeastSquares(req.body);
            // console.log("The data was computed: ", JSON.stringify(req.body, null, 4));
        }
    }

    try {
        const sql =
            "INSERT INTO www.formula_data (formula_id, title, type, components, attributes) VALUES (?, ?, 'buffer', ?, ?) ON DUPLICATE KEY UPDATE components = ?, attributes = ?";
        const [data_row] = await _db.query<Array<RowDataPacket>>(sql, [req.body.formula_id, req.body.title, req.body.components, req.body.attributes, req.body.components, req.body.attributes]);

        const rowsToAdd: {
            cID: string,
            depth1: string | number,
            depth2: string | number | null,
            depth3: string | number | null,
            depth4: string | number | null,
            depth5: string | number | null,
            value: string | number,
            hash: string;
        }[] = [];
        for (let i = 0; i < req.body.compounds.length; i++) {
            const param: { mw: string, name: string; } = {
                mw: '',
                name: ''
            };
            param.mw = req.body.compounds[i].mw;
            param.name = req.body.compounds[i].name;
            const depth_rows = Compound.toSQL(req.body.compounds[i].cID, param);
            //console.log("It's value is: " + JSON.stringify(depth_rows, null, 4));
            rowsToAdd.push(...depth_rows);
        }
        //console.log("This is rowsToAdd" + JSON.stringify(rowsToAdd, null, 4));
        const paramsArr: (string | number | null)[] = [];
        const marks: string[] = [];
        for (let i = 0; i < rowsToAdd.length; i++) {
            paramsArr.push(rowsToAdd[i].cID);
            paramsArr.push(rowsToAdd[i].depth1);
            paramsArr.push(rowsToAdd[i].depth2);
            paramsArr.push(rowsToAdd[i].depth3);
            paramsArr.push(rowsToAdd[i].depth4);
            paramsArr.push(rowsToAdd[i].depth5);
            paramsArr.push(rowsToAdd[i].value);
            paramsArr.push(rowsToAdd[i].hash);
            marks.push("(?, ?, ?, ?, ?, ?, ?, ?)");
        }

        //console.log("Test of paramsArr: " + JSON.stringify(paramsArr, null, 4));
        //console.log("Test of paramsArr: " + JSON.stringify(marks, null, 4));

        const comp_sql = `INSERT IGNORE INTO www.compounds_depth (cID, depth1, depth2, depth3, depth4, depth5, value, hash) VALUES ${marks.join(', ')}`;

        await _db.query<Array<RowDataPacket>>(comp_sql, paramsArr);

        if (!data_row || data_row.length === 0) {
            throw new Error('Error submitting buffer to database');
        }

        r.data = data_row;
        r.code = 200;
        r.json(); //send response back to use

        return;
    }
    catch (e) {
        r.code = 500;
        return r.json();
    }
});
/*
Buffer.post('/get-buffer-list', async (_req, res) => {
    const r = new Res(res);
    interface RowType extends RowDataPacket {formula_id: string, title: string }
    try {
        const sql = "SELECT formula_id, title FROM www.formula_data WHERE type='buffer'";
        const [data_row] = await _db.query<Array<RowType>>(sql);

        if (!data_row || data_row.length === 0) {
            throw new Error('Error retrieving list of buffers');
        }
        r.data = data_row;
        r.code = 200;
        r.json(); //send response back to use

        return;
    }
    catch (e) {
        r.code = 500;
        return r.json();
    }
});
*/
Buffer.post('/get-buffer-info', async (req, res) => {
    const r = new Res(res);
    interface RowType extends RowDataPacket {
        formula_id: string,
        components: { cID: string, amount?: string, amount_type: string, concentration?: string, concentration_type: string; }[],
        attributes: Record<string, unknown>;
    }
    interface RowType2 extends RowDataPacket { cID: string, mw: number, name: string; }
    try {
        const sql = "SELECT formula_id, components, attributes FROM www.formula_data WHERE type='buffer' AND formula_id = ?";
        const [data_row] = await _db.query<Array<RowType>>(sql, [req.body.id]);
        // console.log("Test of data_row: ", JSON.stringify(data_row, null, 4));

        const cIDarr: string[] = [];
        const marks: string[] = [];
        if (data_row !== null) {
            for (let i = 0; i < data_row[0].components.length; i++) {
                const compCID = data_row[0].components[i].cID;
                cIDarr.push(compCID);
                marks.push('?');
            }
        }

        const comp_sql = `SELECT c1.cID, c1.value as mw, c2.value as name FROM www.compounds_depth as c1 INNER JOIN www.compounds_depth as c2 ON c1.cID = c2.cID WHERE c1.depth1 = 'mw' AND c2.depth1 = 'name' AND c1.cID IN (${marks.join(', ')})`;
        const [comp_row] = await _db.query<Array<RowType2>>(comp_sql, cIDarr);
        //console.log("Test of comp_row: " + JSON.stringify(comp_row, null, 4));

        //Check to remove duplicate entries pulled from the db. May be obselete with unique index from hashing.
        const compounds: RowType2[] = [];
        if (comp_row !== null) {
            for (let i = 0; i < comp_row.length; i++) {
                const compoundData = comp_row[i];
                if (compounds.some((obj: RowType2) => obj.cID === compoundData.cID) === false) {
                    compounds.push(compoundData);
                }
            }
        }

        //Orders the compounds to be the same as components after being pulled from the db
        let sortCompounds: RowType2[] = [];
        sortCompounds = compounds.sort((a: RowType2, b: RowType2) => {
            return cIDarr.indexOf(a.cID) - cIDarr.indexOf(b.cID);
        });

        if (data_row !== null) { data_row[0].compounds = sortCompounds; }
        //console.log("Test of db data is: " + JSON.stringify(data_row, null, 4));
        if (!data_row || data_row.length === 0) {
            throw new Error('Error retrieving information of buffers');
        }
        r.data = data_row;
        r.code = 200;
        r.json(); //send response back to use

        return;
    }
    catch (e) {
        r.code = 500;
        return r.json();
    }
});

Buffer.post('/get-compounds-info', async (req, res) => {
    const r = new Res(res);
    interface RowType extends RowDataPacket { mw: number; }
    try {
        const comp_sql = "SELECT value as mw FROM www.compounds_depth WHERE cID = ? AND depth1 ='mw'";
        const [data_row] = await _db.query<Array<RowType>>(comp_sql, [req.body.compoundID]);

        if (!data_row || data_row.length === 0) {
            throw new Error('Error retrieving information of compounds');
        }
        r.data = data_row;
        r.code = 200;
        r.json(); //send response back to use

        return;
    }
    catch (e) {
        r.code = 500;
        return r.json();
    }
});