import express from "express";
import { RowDataPacket } from "mysql2";
import { WorkPortalApp } from "src/types/Index";
import { Res } from "../lib/response";
import { _db } from "../lib/sql";

export const Webcontent = express.Router();

//@ts-ignore
Webcontent.post('/buffer', (req, res) => {
    bufferSQL(req, res);
});

//@ts-ignore
const bufferSQL = async (req, res) => {
    const r = new Res(res);
    interface RowType extends RowDataPacket, WorkPortalApp { };

    try {
        const sql =
            'INSERT INTO formula_data (formula_id, title, type, components, attributes, accepted, update_date) VALUES (?, ?, ?, ?, ?, ?, ?)';

        const data_row = await _db.query<Array<RowType>>(sql, [req.body.formulaId, req.body.title, req.body.type, req.body.components, req.body.attributes, req.body.accepted, req.body.update_date]);

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
};