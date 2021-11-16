import { useEffect, useState } from 'react';

const ProteinConcentrationCalculatorTest = (props: any) => {
    let [timesClicked, updateTimes] = useState(0);

    const clickEvent = () => {
        updateTimes(timesClicked++);
    }

    const conditional = 1;
    const array = [0, 1, 2]

    useEffect(() => {
        //Do something
        const fivetimes = timesClicked * 5;
    }, [timesClicked]);

    //"Modified: text"
    return (
        <>
            <input type="button" onClick={clickEvent} value="Click here"></input><br />
            Times clicked: {timesClicked}
            {timesClicked++}
            {
                //if/else equivalent
                (conditional === 1) ? "" : ""
            }

            {
                //for loop equivalent
                array.map((value: number) => (<div>{value}</div>))
            }
        </>
    )
}

export default ProteinConcentrationCalculatorTest;