import { Editor } from '@tinymce/tinymce-react';
import { RowDataPacket } from 'mysql2';
import React, { ChangeEvent, MutableRefObject, useEffect, useRef, useState } from 'react';
import TinyMCE from '../../components/tinymce/Editor';
import { fetchMeta } from '../../lib/meta';
import Server from '../../lib/server';
import { _db } from '../../server/lib/sql';
import { GenericObject } from '../../types/Common';
import { catalogInitialType, catalogListType } from '../../types/pages/webcontent/Catalog';
import { Routing } from '../../types/Routing';

const initial: catalogInitialType = {
    catalog_id: "",
    title: "",
    main_content: ""
};

const clearInputs = (_data: React.Dispatch<React.SetStateAction<typeof initial>>): void => {
    const initialObj: catalogInitialType = {
        catalog_id: "",
        title: "",
        main_content: ""
    };
    _data(() => {
        return {
            ...initialObj
        };
    });
};

const handleInput = (ev: ChangeEvent<HTMLInputElement>, _data: React.Dispatch<React.SetStateAction<catalogInitialType>>): void => {
    const inputValue = ev.target.value;
    const inputID = ev.target.id as keyof typeof initial;
    const sanTitle = inputValue.toLowerCase()
        .replace(/[^a-z0-9]/gu, '-')
        .replace(/(?:-){2,}/gu, '-')
        .trim();
    _data((old) => {
        return {
            ...old,
            [inputID]: inputValue,
            catalog_id: sanTitle
        };
    });
};

/**
 * Function which handles selection of catalog from the catalog dropdown list. Pulls data from server for selected title and sets values into data.
 * Also sets display to true which shows the rest of the form.
 * @param ev 
 * @param _data 
 * @param _display 
 */
const handleCatalogListClick = (ev: React.MouseEvent<HTMLElement>, _data: React.Dispatch<React.SetStateAction<typeof initial>>, _display: React.Dispatch<React.SetStateAction<boolean>>): void => {
    const title = ev.currentTarget.getAttribute('data-title') as string;
    const id = ev.currentTarget.getAttribute('data-id') as string;
    _display(true);
    const s = new Server<GenericObject, { oID: number, main_content: string; }[]>();
    s.ajax({
        url: '/webcontent/catalog/get-catalog-info',
        type: 'POST',
        data: { id },
        dataType: 'application/json',
        success: (response) => {
            if (response.code === 200) {
                _data((old) => {
                    old.oID = response.data[0].oID;
                    old.title = title;
                    old.catalog_id = id;
                    old.main_content = response.data[0].main_content;
                    return { ...old };
                });
            }
        }
    });
};

/**
 * Function which sends the catalog data to the database. If oID exists, performs an update. If oID does not exist performs an insert ignore. This allows for title editing without creating an unintended new catalog. Saves insertId to oID from the response if insertion occurs.
 * @param data 
 * @param _data 
 */
const submitCatalog = (data: typeof initial, _data: React.Dispatch<React.SetStateAction<typeof initial>>): void => {
    if (data.title === '' || data.main_content === '') { alert("Missing valid input in all fields"); }
    else if (data.title !== '' && data.main_content !== '') {
        const s = new Server<GenericObject, RowDataPacket
        >();
        s.ajax({
            url: '/webcontent/catalog/submit-catalog',
            type: 'POST',
            data: data,
            dataType: 'application/json',
            success: (response) => {
                if (response.data.insertId !== 0) {
                    alert("The catalog data has been added to the server");
                    _data((old) => {
                        old.oID = response.data.insertId;
                        return { ...old };
                    });
                }
                else if (response.data.insertId === 0) { alert("The catalog data has been updated on the server"); }
                else { alert("There was an error sending the catalog data"); }
            }
        });
    }
};

const DisplayCatalogList = (props: { index: number, title: string, id: string, filterTerm: string, _display: React.Dispatch<React.SetStateAction<boolean>>, _data: React.Dispatch<React.SetStateAction<typeof initial>>; }): JSX.Element => {
    const { index, title, id, filterTerm, _display, _data } = props;
    //Filter which returns blank if there are no matches to the entered filterTerm.
    if (filterTerm && title.toLowerCase().indexOf(filterTerm.toLowerCase()) === -1) {
        return (
            <>
            </>
        );
    }
    return (
        <div
            data-index={index}
            data-title={title}
            data-id={id}
            style={{
                display: 'block',
                padding: '5px',
                width: '100%',
                boxSizing: 'border-box',
                cursor: 'pointer'
            }}
            onClick={(ev: React.MouseEvent<HTMLElement>) => { handleCatalogListClick(ev, _data, _display); }}
        >
            {title}
        </div>
    );
};

const CatalogDropdown = (props: { _display: React.Dispatch<React.SetStateAction<boolean>>, _data: React.Dispatch<React.SetStateAction<typeof initial>>, catalogList: catalogListType[]; }): JSX.Element => {
    const { _display, _data, catalogList } = props;
    const [databaseList] = useState<catalogListType[]>(catalogList);
    const [filterTerm, _filterTerm] = useState<string>("");
    return (
        <>
            <input
                value={filterTerm}
                type='text'
                onChange={(ev: ChangeEvent<HTMLInputElement>) => { _filterTerm(ev.target.value); }}
                placeholder='Filter catalogs...'
                style={{
                    display: 'block',
                    width: '100%',
                    boxSizing: 'border-box'
                }}
            />
            <div
                style={{
                    border: '1px solid #AFAFAF',
                    height: '150px',
                    overflowY: 'auto'
                }}>
                {(databaseList) && databaseList.map((param: { title: string, catalog_id: string; }, index: number) => {
                    return (
                        <>
                            <DisplayCatalogList
                                index={index}
                                title={param.title}
                                id={param.catalog_id}
                                filterTerm={filterTerm}
                                _display={_display}
                                _data={_data}
                            />
                        </>
                    );
                })}
            </div>
        </>
    );
};

/**
 * TinyMCE editor component
 * @param props _data, data
 * @returns 
 */
const Basic = (props: { _data: React.Dispatch<React.SetStateAction<typeof initial>>, data: typeof initial; }): JSX.Element => {
    const { _data, data } = props;
    const [editor, _editor] = useState<MutableRefObject<Editor['editor'] | null>>(useRef(null));

    const save = (input: string) => {
        _data((old) => {
            old.main_content = input;
            return { ...old };
        });
    };

    useEffect(() => {
        if (data.main_content !== "") {
            editor.current?.setContent(data.main_content);
        }
        else if (data.main_content === "") {
            editor.current?.setContent("");
        }
    }, [data, editor]);

    return (
        <>
            <TinyMCE
                _editor={_editor}
                save={save}
                id={"1"}
            />
        </>

    );
};

const RenderPageContent = (props: {
    display: boolean,
    _display: React.Dispatch<React.SetStateAction<boolean>>,
    _data: React.Dispatch<React.SetStateAction<typeof initial>>,
    data: typeof initial,
    catalogList: catalogListType[];
}): JSX.Element => {
    const { display, _display, _data, data, catalogList } = props;
    return (
        <>
            <input
                className='action_button'
                type='button'
                value='Create New Entry'
                style={{ alignContent: 'center', }}
                onClick={() => { clearInputs(_data); _display(true); }}
            />
            <br /><br />
            <div>
                <CatalogDropdown
                    _display={_display}
                    _data={_data}
                    catalogList={catalogList}
                />
            </div>
            <br />
            {(display === true) ? <>
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td style={{
                                    fontWeight: 'bold',
                                    width: '250px',
                                    verticalAlign: 'top'
                                }}>Catalog Title: </td>
                                <td><input
                                    style={{ width: '250px' }}
                                    id='title'
                                    value={data.title}
                                    placeholder="Enter catalog title..."
                                    onChange={(ev: ChangeEvent<HTMLInputElement>) => { handleInput(ev, _data); }}
                                /></td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                    <Basic
                        _data={_data}
                        data={data}
                    />
                    <br />
                    <input
                        className='action_button'
                        type='button'
                        value='Submit Catalog'
                        style={{ alignContent: 'center' }}
                        onClick={() => submitCatalog(data, _data)}
                    />
                </div>
            </> : <></>}
        </>
    );
};

const CatalogPage = (props: { catalogList: catalogListType[]; }): JSX.Element => {
    const [data, _data] = useState<catalogInitialType>(initial);
    const [display, _display] = useState<boolean>(false);

    return (
        <>
            <RenderPageContent
                display={display}
                _display={_display}
                _data={_data}
                data={data}
                catalogList={props.catalogList}
            />
        </>
    );
};

export default CatalogPage;

export const getStaticProps = async (context: Routing.Context) => {
    const meta = await fetchMeta(__filename, context);
    const sql = `SELECT title, catalog_id FROM www.catalog_data`;
    interface RowType extends RowDataPacket { title: string, catalog_id: string; }
    let catalogList: Array<RowType> = [];
    try {
        const [db_rows] = await _db.query<Array<RowType>>(sql);
        if (!db_rows) {
            throw new Error('Error retrieving list of catalogs');
        }
        catalogList = db_rows;
    }
    catch (e) {
        console.error(e);
    }
    return ({
        props: {
            meta: meta,
            catalogList: catalogList
        }
    });
};