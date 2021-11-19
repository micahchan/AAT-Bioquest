import React, { useState, useEffect } from 'react';
import { RoundSigFig } from './Rounding'

/* Handling peptide calculations
adding custom proteins to auto recognize
const aa_3: string[] = new Array("ALA", "ARG", "ASN", "ASP", "CYS", "GLU", "GLN", "GLY", "HIS", "ILE", "LEU", "LYS", "MET", "PHE", "PRO", "SER", "THR", "TRP", "TYR", "VAL");
const aa_1: string[] = new Array("A", "R", "N", "D", "C", "E", "Q", "G", "H", "I", "L", "K", "M", "F", "P", "S", "T", "W", "Y", "V");
*/

const ProteinConcentrationCalculator = (props: any) => {
  const [selectProtein, _selectProtein] = useState("IgG");
  const [sequence, _sequence] = useState("");
  const [mw, _mw] = useState(150000);
  const [ec, _ec] = useState(210000);
  const [absorbance, _absorbance] = useState(0);
  const [dilutionFactor, _dilutionFactor] = useState(0);
  const [pathlength, _pathlength] = useState(0);
  const [results, _results] = useState<Object | null>(null);

  //const [test, _test] = useState(0);

  const calculateResult = () => {
    const value = absorbance * mw * dilutionFactor / (ec * pathlength);
    return value;
  }

  const handleDropDownMenu = (event: any) => {
    const state = event.target.value;
    _selectProtein(state);
    let valueEC = event.target[event.target.selectedIndex].getAttribute('data-ec');
    _ec(valueEC);
    let valueMW = event.target[event.target.selectedIndex].getAttribute('data-mw');
    _mw(valueMW);
  }

  const handleInputAbsorbance = (event: any) => {
    const value = event.target.value;
    _absorbance(value);
  }

  const handleInputDilutionFactor = (event: any) => {
    const value = event.target.value;
    _dilutionFactor(value);
  }

  const handleInputPathlength = (event: any) => {
    const value = event.target.value;
    _pathlength(value);
  }

  const handleCalculateButtonClick = (event: any) => {
    const value = RoundSigFig(calculateResult(), 2);
    //const test = RoundSigFig(value, 2);
    _results(value);
    //_test(test);
  }

  return (
    <>
      <table className="inputTable" style={{ width: "100%", display: "block" }}>
        <tbody>
          <tr>
            <td>Protein</td>
            <td><select className="selectProtein" onChange={handleDropDownMenu}>
              <option value="IgG" data-ex={280} data-ec={210000} data-mw={150000} data-ctype="equation">IgG - Immunoglobulin G</option>
              <option value="BSA" data-ex={280} data-ec={43824} data-mw={66463} data-ctype="equation">BSA - Bovine serum albumin</option>
              <option value="PE" data-ex={565} data-ec={1960000} data-mw={240000} data-ctype="equation">PE - Phycoerythrin</option>
              <option value="APC" data-ex={650} data-ec={700000} data-mw={105000} data-ctype="equation">APC - Allophycocyanin</option>
              <option value="Streptavidin" data-ex={280} data-ec={176000} data-mw={55000} data-ctype="equation">Streptavidin</option>
              <option className="customOption" value="custom" data-ex={280} data-ec={48150} data-mw={69294} data-ctype="equation">Custom sequence</option>
            </select></td>
          </tr>
          {/*Custom protein sequence layout only appears if option is chosen from drop down menu */}
          {(selectProtein === "custom") ?
            <>
              < tr className="customSeq" style={{ display: "table-row" }}>
                <td>Sequence</td>
                <td><textarea
                  className="sequenceArea"
                  style={{ width: "100%", minHeight: "50px", resize: "none" }}
                  placeholder="example: AlaLysVal or AKV or UniProt ID (eg. P02769 for BSA)">
                  {/* input snippet: onkeypress="return inValid(event);" onkeyup="calcPeptide(this,event,0)" onchange="calcPeptide(this,event,1)" */}
                </textarea></td>
              </tr>
              <tr className="customSeq" style={{ display: "table-row" }}>
                <td>Name</td>
                <td className="pName">Not identified</td>
              </tr>
              <tr className="customSeq" style={{ display: "table-row" }}>
                <td>MW</td>
                <td className="pMW">Waiting for sequence</td>
              </tr>
              <tr className="customSeq" style={{ display: "table-row" }}>
                <td>Extinction coefficient</td>
                <td className="pEC">Waiting for sequence</td>
              </tr>
            </>
            : ""}
          <tr>
            <td>Absorbance at λ<sub>max</sub></td>
            <td><input
              type="number"
              className="maxAbsorbance"
              onChange={handleInputAbsorbance}
              placeholder="at 280 nm"
            />
            </td>
          </tr>
          <tr>
            <td>Dilution factor (optional)</td>
            <td><input
              type="number"
              className="dilutionFactor"
              onChange={handleInputDilutionFactor}
              placeholder=""
            />
            </td>
          </tr>
          <tr>
            <td>Pathlength</td>
            <td><input
              type="number"
              className="pathlength"
              onChange={handleInputPathlength}
              placeholder="standard is 1 cm"
            /> cm
            </td>
          </tr>
          <tr>
            <input
              type="button"
              className="calculateButton"
              onClick={handleCalculateButtonClick}
              value="Calculate"
            />
          </tr>
          {(results === null) ? "" :
            <>
              <br /> THis is the protein: {selectProtein}
              <br /> This is the absorbance: {absorbance}
              <br /> This is the dilution factor: {dilutionFactor}
              <br /> THis is the pathlength: {pathlength}
              <br /> This is the ec: {ec}
              <br /> this is the mw: {mw}
              <br />This is the result: {results}
              {/*<br />This is the rounded result: {test}*/}
            </>
          }
        </tbody>
      </table>
    </>
  )
}

export default ProteinConcentrationCalculator;
