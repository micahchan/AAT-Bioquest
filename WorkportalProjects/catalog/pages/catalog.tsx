import { Editor } from '@tinymce/tinymce-react';
import React, { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import TinyMCE from '../../components/tinymce/Editor';
import { fetchMeta } from '../../lib/meta';
import Server from '../../lib/server';
import { catalogInitialType } from '../../types/pages/webcontent/Catalog';
import { Routing } from '../../types/Routing';

const s = new Server();

const initial: catalogInitialType = {
    catalog_id: "",
    title: "",
    main_content: ""
};

const clearInputs = (_data: React.Dispatch<React.SetStateAction<typeof initial>>) => {
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

const handleInput = (ev: any, _data: React.Dispatch<React.SetStateAction<typeof initial>>) => {
    const inputValue = ev.target.value;
    const inputID = ev.target.id;
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

const handleCatalogListClick = (ev: any, _data: React.Dispatch<React.SetStateAction<typeof initial>>, _display: React.Dispatch<React.SetStateAction<boolean>>) => {
    const title = ev.target.getAttribute('data-title');
    const id = ev.target.getAttribute('data-id');
    _display(true);
    s.ajax({
        url: '/api/webcontent/catalog/get-catalog-info',
        type: 'POST',
        data: { id },
        dataType: 'application/json',
        success: (response: any) => {
            if (response.code === 200) {
                console.log("Reponse data is: " + JSON.stringify(response.data, null, 4));
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

const submitCatalog = (data: typeof initial, _data: React.Dispatch<React.SetStateAction<typeof initial>>) => {
    console.log("The submitting data is: " + JSON.stringify(data, null, 4));
    if (data.title === '' || data.main_content === '') { alert("Missing valid input in all fields"); }
    else if (data.title !== '' && data.main_content !== '') {
        s.ajax({
            url: '/api/webcontent/catalog/submit-catalog',
            type: 'POST',
            data: data,
            dataType: 'application/json',
            success: (response: any) => {
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

const DisplayCatalogList = (props: { index: number, title: string, id: string, filterTerm: any, _display: React.Dispatch<React.SetStateAction<boolean>>, _data: React.Dispatch<React.SetStateAction<typeof initial>>; }) => {
    const { index, title, id, filterTerm, _display, _data } = props;
    //Filter which returns blank if there is no matches to the entered filterTerm.
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
            onClick={(ev: any) => { handleCatalogListClick(ev, _data, _display); }}
        >
            {title}
        </div>
    );
};

const CatalogDropdown = (props: { _display: React.Dispatch<React.SetStateAction<boolean>>, _data: React.Dispatch<React.SetStateAction<typeof initial>>; }) => {
    const [databaseList, _databaseList] = useState<any>();
    const [filterTerm, _filterTerm] = useState<string>();
    const { _display, _data } = props;
    //TODO: Convert to a get static props situation
    useEffect(() => {
        s.ajax({
            url: '/webcontent/catalog/get-catalog-list',
            type: 'POST',
            data: {},
            dataType: 'application/json',
            success: (response: any) => {
                if (response.code === 200) {
                    console.log("Test of response: " + JSON.stringify(response.data, null, 4));
                    _databaseList(response.data);
                }
            }
        });
    }, []);
    return (
        <>
            <input
                value={filterTerm}
                type='text'
                onChange={(ev: any) => { _filterTerm(ev.target.value); }}
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
                {(databaseList) && databaseList.map((param: any, index: number) => {
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

const Basic = (props: { _data: React.Dispatch<React.SetStateAction<typeof initial>>, data: typeof initial, editor: MutableRefObject<Editor['editor'] | null>, _editor: Dispatch<SetStateAction<MutableRefObject<Editor['editor'] | null>>>, display: boolean; }) => {
    const { _data, data, editor, _editor, display } = props;

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
    }, [data]);

    return (
        <>
            {(display === true) ?
                <div><TinyMCE
                    _editor={_editor}
                    save={save}
                /> </div> : <></>}
        </>

    );
};

const RenderPageContent = (props: {
    display: boolean,
    _display: React.Dispatch<React.SetStateAction<boolean>>,
    _data: React.Dispatch<React.SetStateAction<typeof initial>>,
    data: typeof initial,
    editor: MutableRefObject<Editor['editor'] | null>,
    _editor: Dispatch<SetStateAction<MutableRefObject<Editor['editor'] | null>>>;
}) => {
    const { display, _display, _data, data, editor, _editor } = props;
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
                                    onChange={(ev: any) => { handleInput(ev, _data); }}
                                /></td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                    <Basic
                        _data={_data}
                        data={data}
                        editor={editor}
                        _editor={_editor}
                        display={display} />
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

const CatalogPage = () => {
    const [data, _data] = useState<typeof initial>(initial);
    const [display, _display] = useState<boolean>(false);
    const [editor, _editor] = useState<MutableRefObject<Editor['editor'] | null>>(useRef(null));

    return (
        <>
            <RenderPageContent
                display={display}
                _display={_display}
                _data={_data}
                data={data}
                editor={editor}
                _editor={_editor}
            />
        </>
    );
};

export default CatalogPage;

export const getStaticProps = async (context: Routing.Context) => {
    const meta = await fetchMeta(__filename, context);
    return ({ props: { meta: meta } });
};