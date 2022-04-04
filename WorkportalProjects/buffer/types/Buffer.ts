export type bufferListType = {
    formula_id: string,
    title: string;
};

export type bufferNotesType = {
    final: string | "",
    special: null,
    additional: null,
};

export type bufferPhType = {
    amount: string | number | '',
    conjAmount: string | number | '',
    pH: string | number | '';
};

export type bufferComponentType = {
    cID: string | '',
    amount?: string | '',
    amount_type: string,
    concentration?: string | '',
    concentration_type: string;
};
/*
export type variableComponentType = {
    cID: string | '',
    amount_type: string,
    concentration_type: string;
};
*/
export type bufferCompoundType = {
    cID: string | '',
    mw: number | '',
    name: string | '';
};

export type bufferVariable_dataType = {
    min_ph: number | '',
    max_ph: number | '',
    m?: number | '',
    b?: number | '',
    og_denom?: number | '';
};

export type bufferAttributes = {
    pH?: number | '',
    molarity?: number | '',
    base_solvent: string | '',
    source: string | '',
    description: string | '',
    type: string | '',
    notes: {
        final: string | '',
        special: null,
        additional: null,
    };
    variable_data?: {
        min_ph?: number | '',
        max_ph?: number | '',
        m?: number | '',
        b?: number | '',
        og_denom?: number | '';
    };
    phArr?: Array<bufferPhType>;
};
/*
export type variableBufferType = {
    base_solvent: string | '',
    source: string | '',
    description: string | '',
    type: string | '',
    notes: {
        final: string | '',
        special: null,
        additional: null,
    };
    variable_data: {
        min_ph: number | '',
        max_ph: number | '',
    };
    phArr: Array<phType>;
};
*/
export type bufferInitialType = {
    bufferType: string,
    formula_id: string | '',
    title: string | '',
    components: Array<bufferComponentType>,
    attributes: bufferAttributes,
    compounds: Array<bufferCompoundType>;
};

export type bufferLayoutRow = {
    rowLabel?: string,
    id: string,
    type?: string,
    placeholder?: string,
    rowComponent: CallableFunction;
};