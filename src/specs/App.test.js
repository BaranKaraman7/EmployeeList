import { generateDate, generateName, generateSurname, generateWorkPosition } from "../utils/utils";
import { workPosition } from "../utils/enums/workPosition";
import { render } from "@testing-library/react";
import { AgGridReact } from "ag-grid-react";
import { getColDef } from '../components/columnDef';
import { createNewEmployeeList } from '../utils/utils';
//I used antd it has some issues testing 
// with jest so can't do render test

// test('Row Component Fails', ()=>{
//     render(<Row/>)
// })
const myEmployeeTemplate = {
    name: 'Baran',
    surname: 'Karaman',
    workPosition: workPosition[0],
    birthDay: new Date(2022, 7, 25),
}
test('Utils create employee name correctly', () => {
    const employeeName = generateName();
    expect(employeeName.types).toEqual(myEmployeeTemplate.name.types)
})
test('Utils create employee surname correctly', () => {
    const employeeSurname = generateSurname();
    expect(employeeSurname.types).toEqual(myEmployeeTemplate.surname.types)
})
test('Utils create employee work position correctly', () => {
    const employeeWorkPosition = generateWorkPosition();
    expect(employeeWorkPosition.types).toEqual(myEmployeeTemplate.workPosition.types)
})
test('Utils create employee birthday correctly', () => {
    const employeeBirthDay = generateDate();
    expect(employeeBirthDay.types).toEqual(myEmployeeTemplate.birthDay.types)
})
test('Grid rendered correctly without edit button',()=>{
    render(<AgGridReact
    gridOptions={{
    rowData: createNewEmployeeList(5),
    rowSelection: 'single',
    columnDefs: getColDef(()=>{})
        }
    }
    ></AgGridReact>)
    }
)