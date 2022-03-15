import express from "express";
import { RowDataPacket } from "mysql2";
import { WorkPortalApp } from "../../../types/Index";
import { Res } from "../../lib/response";
import { _db } from "../../lib/sql";

export const Catalog = express.Router();

//@ts-ignore
Catalog.post('/get-catalog-list', async (req, res) => {
    const r = new Res(res);
    interface RowType extends RowDataPacket, WorkPortalApp { };
    try {
        const sql = `SELECT title, catalog_id FROM www.catalog_data`;
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
Catalog.post('/submit-catalog', async (req, res) => {
    const r = new Res(res);
    interface RowType extends RowDataPacket, WorkPortalApp { };

    try {
        const sql =
            "INSERT INTO www.catalog_data (catalog_id, title, main_content) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE main_content = ?";
        const [data_row] = await _db.query<Array<RowType>>(sql, [req.body.catalog_id, req.body.title, req.body.main_content, req.body.main_content]);

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
Catalog.post('/get-catalog-info', async (req, res) => {
    const r = new Res(res);
    interface RowType extends RowDataPacket, WorkPortalApp { };

    try {
        const sql = "SELECT main_content FROM www.catalog_data WHERE catalog_id = ?";
        const [data_row] = await _db.query<Array<RowType>>(sql, [req.body.id]);

        console.log("Test of db pull, data_row is: " + JSON.stringify(data_row, null, 4));

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

