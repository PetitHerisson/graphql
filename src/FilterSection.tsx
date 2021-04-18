import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { Checkbox, FormGroup } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useQuery, gql } from '@apollo/client'
import { SET_ROWS, SET_COLUMNS } from './reducer'
import store from './store';
import { ItemType } from './type';
import { GridColDef, GridRowData, GridRowsProp } from '@material-ui/data-grid';
import LinearProgress from '@material-ui/core/LinearProgress';

export default function FormControlLabelPlacement() {
    const [value, setValue] = React.useState('countries');
    const items: ItemType[] = [
        {
            value: 'continents',
            label: 'Continent'
        },
        {
            value: 'countries',
            label: 'Country'
        },
        {
            value: 'cities',
            label: 'City'
        },
        {
            value: 'id',
            label: 'ID'
        },
        {
            value: 'alpha3Code',
            label: 'Alpha 3 Code'
        },
        {
            value: 'population',
            label: 'Population'
        },
        {
            value: 'currencies',
            label: 'Currency'
        },
        {
            value: 'languages',
            label: 'Language'
        },
        {
            value: 'timeZone',
            label: 'TimeZone'
        },
        {
            value: 'capital',
            label: 'Capital'
        },
    ]
    const query = gql`
        query MyData {
            countries {
                name
                population
                id
                currencies {
                  name
                }
                cities {
                  name
                }
                capital {
                  name
                }
                alpha3Code
                languages {
                  name
                }
            }
        }
    `
    const [queryString, setQueryString] = React.useState(query)
    const { loading, error, data } = useQuery(queryString)
    React.useEffect(() => {
        handleSumbit()
    }, [data])
    const [state, setState] = React.useState({
        countries: false,
        cities: true,
        population: true,
        currencies: true,
        languages: true,
        timeZone: false,
        capital: true,
        id: true,
        alpha3Code: true,
        selectedFields: ['cities', 'id', 'alpha3Code', 'population', 'currencies', 'languages', 'capital'] as string[]
    });

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
        setState({
            countries: false,
            cities: false,
            population: false,
            currencies: false,
            languages: false,
            timeZone: false,
            capital: false,
            id: false,
            alpha3Code: false,
            selectedFields: []
        })
    };

    const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [e.target.name]: e.target.checked });
        const { selectedFields } = state
        e.target.checked ? selectedFields.push(e.target.name) : selectedFields.splice(selectedFields.indexOf(e.target.name), 1)
    };

    let columns = [] as GridColDef[]
    let rows = [] as GridRowsProp
    let capitalName = '' as string
    const handleSumbit = () => {
        const { selectedFields } = state
        let cols = [] as ItemType[]
        items.forEach(item => {
            selectedFields.forEach(field => {
                if (item.value === field) {
                    cols.push(item)
                }
            })
            if (item.value === value) {
                capitalName = item.label
            }
        })
        columns.push({ field: 'col1', headerName: `${capitalName} Name`, width: 130, description: 'name' })
        for (let i = 2; i < cols.length + 2; i++) {
            columns.push({ field: `col${i}`, headerName: cols[i - 2].label, width: 130, description: cols[i - 2].value })
        }
        store.dispatch(SET_COLUMNS(columns))
        const props = selectedFields.reduce((all, cur) => {
            const fieldsWithName = ['currencies', 'languages', 'capital', 'cities', 'timeZone', 'countries']
            return fieldsWithName.indexOf(cur) !== -1 ?
                `${all} \n ${cur} {name}` : `${all} \n ${cur}`
        }, 'name')

        const queryString = gql`query MyData { ${value} {${props}}}`
        setQueryString(queryString)
        let queryResult
        if (data) {
            switch (value) {
                case 'continents':
                    queryResult = data.continents
                    break
                case 'countries':
                    queryResult = data.countries
                    break
                case 'cities':
                    queryResult = data.cities
                    break
                default:
                    queryResult = ''
            }
        }
        for (let i = 0; i < queryResult?.length; i++) {
            let row = {} as GridRowData
            row.id = i + 1
            row.col1 = queryResult[i].name
            for (let j = 2; j < columns.length + 2; j++) {
                const columnName = columns[j - 1]?.description || ''
                switch (columnName) {
                    case 'countries':
                        row[`col${j}`] = queryResult[i].countries.length
                        break
                    case 'cities':
                        row[`col${j}`] = queryResult[i].cities.length
                        break
                    case 'id':
                        row[`col${j}`] = queryResult[i].id
                        break
                    case 'alpha3Code':
                        row[`col${j}`] = queryResult[i].alpha3Code
                        break
                    case 'population':
                        row[`col${j}`] = queryResult[i].population
                        break
                    case 'currencies':
                        row[`col${j}`] = queryResult[i].currencies?.name
                        break
                    case 'languages':
                        row[`col${j}`] = queryResult[i].languages[0]?.name
                        break
                    case 'timeZone':
                        row[`col${j}`] = queryResult[i].timeZone?.name
                        break
                    case 'capital':
                        row[`col${j}`] = queryResult[i].capital?.name
                        break
                }
            }
            rows.push(row)
        }
        store.dispatch(SET_ROWS(rows))
    }

    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">Select</FormLabel>
            <RadioGroup row aria-label="position" name="position" defaultValue="countries" value={value} onChange={handleRadioChange}>
                <FormControlLabel value="continents" control={<Radio color="primary" />} label="Continent" />
                <FormControlLabel value="countries" control={<Radio color="primary" />} label="Country" />
                <FormControlLabel value="cities" control={<Radio color="primary" />} label="City" />
            </RadioGroup>
            <FormGroup row>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={state.countries}
                            onChange={handleCheckChange}
                            name="countries"
                            color="primary"
                            disabled={value !== 'continents' ? true : false}
                        />
                    }
                    label="Countries"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={state.cities}
                            onChange={handleCheckChange}
                            name="cities"
                            color="primary"
                            disabled={value === 'countries' ? false : true}
                        />
                    }
                    label="Cities"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={state.id}
                            onChange={handleCheckChange}
                            name="id"
                            color="primary"
                        />
                    }
                    label="ID"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={state.alpha3Code}
                            onChange={handleCheckChange}
                            name="alpha3Code"
                            color="primary"
                            disabled={value === 'countries' ? false : true}
                        />
                    }
                    label="Alpha 3 Code"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={state.population}
                            onChange={handleCheckChange}
                            name="population"
                            color="primary"
                        />
                    }
                    label="Population"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={state.currencies}
                            onChange={handleCheckChange}
                            name="currencies"
                            color="primary"
                            disabled={value === 'countries' ? false : true}
                        />
                    }
                    label="Currency"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={state.languages}
                            onChange={handleCheckChange}
                            name="languages"
                            color="primary"
                            disabled={value === 'countries' ? false : true}
                        />
                    }
                    label="Language"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={state.timeZone}
                            onChange={handleCheckChange}
                            name="timeZone"
                            color="primary"
                            disabled={value === 'cities' ? false : true}
                        />
                    }
                    label="TimeZone"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={state.capital}
                            onChange={handleCheckChange}
                            name="capital"
                            color="primary"
                            disabled={value === 'countries' ? false : true}
                        />
                    }
                    label="Capital"
                />
            </FormGroup>
            <Button variant="contained" color="primary" onClick={handleSumbit}>Sumbit</Button>
            {loading ? <LinearProgress /> : ''}
        </FormControl>
    );
}
