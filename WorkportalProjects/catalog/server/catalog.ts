import express from "express";
import { RowDataPacket } from "mysql2";
import { WorkPortalApp } from "../../../types/User";
import { Res } from "../../lib/response";
import { _db } from "../../lib/sql";

export const Catalog = express.Router();

Catalog.post('/get-catalog-list', async (_req, res) => {
    const r = new Res(res);
    interface RowType extends RowDataPacket, WorkPortalApp { }
    try {
        const sql = `SELECT title, catalog_id FROM www.catalog_data`;
        const [data_row] = await _db.query<Array<RowType>>(sql);

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

Catalog.post('/submit-catalog', async (req, res) => {
    const r = new Res(res);
    interface RowType extends RowDataPacket, WorkPortalApp { }

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
        const [data_row] = await _db.query<Array<RowType>>(sql, param);
        console.log("The final result after submit is: " + JSON.stringify(data_row, null, 4));

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
    interface RowType extends RowDataPacket, WorkPortalApp { }

    try {
        const sql = "SELECT oID, main_content FROM www.catalog_data WHERE catalog_id = ?";
        const [data_row] = await _db.query<Array<RowType>>(sql, [req.body.id]);

        console.log("Test of db pull, data_row is: " + JSON.stringify(data_row, null, 4));

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
/*
Catalog.post('/new-entry', async (req, res) => {
    const r = new Res(res);
    interface RowType extends RowDataPacket, WorkPortalApp { };

    try {
        //TODO: craft sql statement to create a blank entry and retrieve the oID
        const sql = 'INSERT INTO www.catalog_data (catalog_id) VALUES (""); SELECT oID FROM www.catalog_data WHERE catalog_id =""';

        console.log("The crafted sql statement is: " + sql);
        const [data_row] = await _db.query<Array<RowType>>(sql);

        console.log("Test of new entry pull, data_row is: " + JSON.stringify(data_row, null, 4));

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
*/