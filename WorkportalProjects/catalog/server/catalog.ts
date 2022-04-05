import express from "express";
import { RowDataPacket } from "mysql2";
import { Res } from "../../lib/response";
import { _db } from "../../lib/sql";

export const Catalog = express.Router();

Catalog.post('/submit-catalog', async (req, res) => {
    const r = new Res(res);
    try {
        let sql;
        let param = [];
        if (req.body.oID) {
            sql = `UPDATE www.catalog_data SET catalog_id = ?, title = ?, main_content = ? WHERE oID = ?`;
            param = [req.body.catalog_id, req.body.title, req.body.main_content, req.body.oID];
        }
        else {
            sql =
                "INSERT IGNORE INTO www.catalog_data (catalog_id, title, main_content) VALUES (?, ?, ?)";
            param = [req.body.catalog_id, req.body.title, req.body.main_content];
        }
        const [data_row] = await _db.query<Array<RowDataPacket>>(sql, param);

        if (!data_row || data_row.length === 0) {
            throw new Error('Missing data');
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

Catalog.post('/get-catalog-info', async (req, res) => {
    const r = new Res(res);
    interface RowType extends RowDataPacket { oID: number, main_content: string; }

    try {
        const sql = "SELECT oID, main_content FROM www.catalog_data WHERE catalog_id = ?";
        const [data_row] = await _db.query<Array<RowType>>(sql, [req.body.id]);

        if (!data_row || data_row.length === 0) {
            throw new Error('Missing data');
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