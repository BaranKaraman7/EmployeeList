import { CellClickedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { Button } from "antd";
export const getColDef= (onEditButtonClick: any)=> {
    const columnDefs: ColDef[] = [
        { field: 'name', filter: true, width: 175, sortable: true },
        { field: 'surname', filter: true, width: 175, sortable: true },
        { field: 'workPosition', width: 200, sortable: true },
        {
          field: 'dateOfBirth',
          width: 200,
          sortable: true,
          cellRenderer: (params: ICellRendererParams) => {
            const date: Date = params.value;
            const value: string = (date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear());
            return value;
          },
        },
        {
          field: '',
          width: 100,
          cellRenderer: () => {
            return <Button className='Button' type='primary' ghost>Edit</Button>
          },
          onCellClicked: (params: CellClickedEvent) => onEditButtonClick(params)
        },
        {
          field: '',
          width: 100,
          cellRenderer: () => {
            return <Button className='Button' type='primary' danger ghost>Fire</Button>
          },
          onCellClicked: (params: CellClickedEvent) => {
            const selectedRows = params.api.getSelectedRows()
            params.api.applyTransaction({ remove: selectedRows });
          }
        },
      ];

    return columnDefs;
}
