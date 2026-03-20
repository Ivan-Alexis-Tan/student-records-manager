import { useEffect, useState } from "react"
import { capitalEveryWord } from "../services/helperFunctions"

const attribs = ["last_name", "first_name", "id"]

export default function SearchData({ 
    setStateFn = () => {}, 
    data = [],
    searchLabel = 'Search: ',
}) {
    const [attribIdx, setAttribIdx] = useState(0)
    const [attribKey, setAttribKey] = useState(attribs[attribIdx])
    const [searchVal, setSearchVal] = useState('')
    const [searchResults, setSearchResults] = useState([])

    // Search Attrib Toggle
    useEffect( () => {
        setAttribKey(attribs[attribIdx % attribs.length])
    }, [attribIdx])

    // Search Auto-filtering
    useEffect( () => {
        if (searchVal !== '') {
            setSearchResults(
                data.reduce((acc, student) => {
                    const loweredVal = searchVal.toLowerCase()
                    if (student[attribKey].toLowerCase().startsWith(loweredVal)) acc.push(student);
                    return acc
                }, [])
            )
        }
        else setSearchResults([]);
    }, [searchVal, data, attribKey])

    return (
        <div>
            {/* Search Student Form */}
            <div>
                <label title="Click to change searching key"
                    onClick={_ => {
                        setAttribIdx(prev => prev + 1)
                        setSearchVal('')
                    }}
                >{searchLabel}</label>
                <input type="text"
                    title="Search student"
                    placeholder={capitalEveryWord(attribKey, '_')}
                    value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                />
            </div>
            
            {/* Search Results */}
            <div>
                {(searchResults.length >= 1) && <ul>{searchResults.map(student => <li 
                        key={student.id}
                        onClick={_ => {
                            setStateFn(student)
                            setSearchVal(`${student.first_name} ${student.last_name}`)
                        }}
                        >(G{student.grade_lvl}) {student.first_name} {student.last_name}
                    </li>
                )}</ul>}
            </div>
        </div>
    )
}