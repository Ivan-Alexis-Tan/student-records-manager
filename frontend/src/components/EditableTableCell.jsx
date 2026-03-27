import { useState } from "react"

const editDetailsDefault = {rowId: "", col: '', value: ''}
const coordsDefault = {rowId: '', col: ''}

export function useCellState() {
    const [coords, setCoords] = useState(coordsDefault)
    const [editDetails, setEditDetails] = useState(editDetailsDefault)

    function resetEditDetails() {setEditDetails(editDetailsDefault)}
    function resetAll() {
        setCoords(coordsDefault)
        setEditDetails(editDetailsDefault)
    }

    return {
        coords,
        setCoords,
        editDetails,
        setEditDetails,
        resetEditDetails,
        resetAll,
        cellStates: {
            coords,
            setCoords,
            editDetails,
            setEditDetails,
            resetEditDetails,
            resetAll,
        }
    }
}

/** @type {{id: string, cellData: (string|number|bool)[], column: string, saveEditFn: () => void}*/
const setConfigs = {
    id: "",
    cellData: [],
    column: "",
    saveEditFn: () => null,
}

export default function EditableTableCell({ 
    type = 'input',  
    configs = setConfigs, 
    cellStates = {},
    selectType = {
        selectOptions: [],
        nullOption: "",
    }
} = {}) {
    const coords = cellStates.coords
    const selectOptions = selectType.selectOptions ?? []

    function handleKeyUp(e) {
        if (e.key === 'Escape') cellStates.resetAll();

        if (e.key === 'Enter') {
            configs.saveEditFn()
            cellStates.resetAll()
        }
    }

    let inputType
    switch(type) {
        case 'select':
            inputType = <>
                <select onChange={e => cellStates.setEditDetails({...coords, value: e.target.value})}>
                    {selectType.nullOption && <option value={"None"}>{selectType.nullOption}</option>}
                    {selectOptions.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
                <button onClick={_ => {
                    configs.saveEditFn()
                    cellStates.resetAll()
                }}>💾</button>
                <button onClick={_ => cellStates.resetAll()}
                >❌</button>
            </>
            break
        default:
            inputType = <input type="text" 
                placeholder={configs.cellData} 
                onKeyUp={e => handleKeyUp(e)}
                value={cellStates.editDetails.value}
                onChange={e => cellStates.setEditDetails({...coords, value: e.target.value})}
            />
    }

    return (
        (coords.rowId === configs.id && coords.col === configs.column) 
            ? <td>
                {inputType}
            </td>
            : <td onDoubleClick={_ => cellStates.setCoords({rowId: configs.id, col: configs.column})}
            >{configs.cellData}</td>
    )
}