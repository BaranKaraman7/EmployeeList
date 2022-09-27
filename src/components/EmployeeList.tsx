import { AgGridReact } from 'ag-grid-react';
import { useState, useRef } from 'react';
import { IEmployee } from '../interfaces/IEmployee'
import { workPosition } from '../utils/enums/workPosition';
import { createNewEmployeeList } from '../utils/utils';
import { CellClickedEvent, ColDef, GridApi, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { Button, Col, DatePicker, Form, Input, Layout, Modal, Row, Select } from 'antd';
import Search from 'antd/lib/input/Search';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
const EmployeeList = () => {
  const [employees] = useState<IEmployee[]>(createNewEmployeeList(15));
  const [isEditModalOpen, setEditIsModalOpen] = useState(false);
  const [isRegModalOpen, setRegIsModalOpen] = useState(false);
  const [gridApi, setGridApi]= useState<GridApi>();
  const employee = useRef<IEmployee>();
  // const gridRef = useRef<any>();
  const formEditRef = useRef<any>();
  const formRegRef = useRef<any>();
  const { Option } = Select;

  const onGridReady = (params: any) => {
    setGridApi(params.api);
  }
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
      onCellClicked: (params: CellClickedEvent) => {
        employee.current = params.data;
        if (formEditRef.current)
          formEditRef.current.setFieldsValue({
            'name': employee.current?.name,
            'surname': employee.current?.surname,
            'workPosition': employee.current?.workPosition,
          })
        showEditModal();
      }
    },
    {
      field: '',
      width: 100,
      cellRenderer: () => {
        return <Button className='Button' type='primary' danger ghost>Fire</Button>
      },
      onCellClicked: (params: CellClickedEvent) => {
        const selectedRows = params.api.getSelectedRows()
        console.log(params);
        params.api.applyTransaction({ remove: selectedRows });
      }
    },
  ];
  const gridOptions: GridOptions = {
    rowData: employees,
    rowSelection: 'single',
    columnDefs: columnDefs,
    
  }
  
  function onFilterTextBoxChange(value: string) {
    gridApi?.setQuickFilter(value);
  }
  const showEditModal = () => {
    setEditIsModalOpen(true);
  };

  const handleEditOk = async () => {
    try {
      const fieldValue = await formEditRef.current.validateFields()
      let rowData = gridApi?.getSelectedRows()[0];
      if (typeof fieldValue.workPosition == 'number') {
        rowData = {
          id: rowData.id,
          name: fieldValue.name,
          surname: fieldValue.surname,
          workPosition: workPosition[fieldValue.workPosition],
          dateOfBirth: rowData.dateOfBirth
        }
      }
      else {
        rowData = {
          id: rowData.id,
          name: fieldValue.name,
          surname: fieldValue.surname,
          workPosition: fieldValue.workPosition,
          dateOfBirth: rowData.dateOfBirth
        }
      }
      gridApi?.getSelectedNodes()[0].setData(rowData);
      setEditIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditCancel = () => {
    setEditIsModalOpen(false);
    formEditRef.current.resetFields();
  };
  const showRegModal = () => {
    setRegIsModalOpen(true);
  };
  function getID(){
    return gridApi?.getDisplayedRowAtIndex(gridApi?.getDisplayedRowCount() - 1)?.data.id + 1
  }
  const handleRegOk = async () => {
    try {
      const fieldValue = await formRegRef.current.validateFields();
      let rowData = {
        id: getID(),
        name: fieldValue.name,
        surname: fieldValue.surname,
        workPosition: workPosition[fieldValue.workPosition],
        dateOfBirth: fieldValue.dateOfBirth._d
      }
      gridApi?.applyTransaction({ add: [rowData] });
      setRegIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleRegCancel = () => {
    setRegIsModalOpen(false);
    formRegRef.current.resetFields();
  };
  return (
    <div className='EmployeeList'>
      <Layout className='layout'>
        <Modal title="Employee Information"
          open={isEditModalOpen}
          onOk={handleEditOk}
          onCancel={handleEditCancel}
          okText='Save Changes'>
          <Form
            ref={formEditRef}
            layout='vertical'
            initialValues={{
              'name': employee.current?.name,
              'surname': employee.current?.surname,
              'workPosition': employee.current?.workPosition,
            }}
          >
            <Form.Item name='name' label='Name' rules={[{ required: true, message: 'Please input the name of employee' }]}>
              <Input>
              </Input>
            </Form.Item>
            <Form.Item name='surname' label='Surname' rules={[{ required: true, message: 'Please input the surname of employee' }]}>
              <Input>
              </Input>
            </Form.Item>
            <Form.Item name='workPosition' label='Work Position' rules={[{ required: true, message: 'Please input the work position of employee' }]}>
              <Select>
                <Option value={0}>{workPosition[0]}</Option>
                <Option value={1}>{workPosition[1]}</Option>
                <Option value={2}>{workPosition[2]}</Option>
                <Option value={3}>{workPosition[3]}</Option>
                <Option value={4}>{workPosition[4]}</Option>
                <Option value={5}>{workPosition[5]}</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        <Modal title='Register New Employee'
          open={isRegModalOpen}
          onOk={handleRegOk}
          onCancel={handleRegCancel}
          okText='Hire'>
          <Form
            ref={formRegRef}
            layout='vertical'>
            <Form.Item name='name' label='Name' rules={[{ required: true, message: 'Please input the name of employee' }]}>
              <Input></Input>
            </Form.Item>
            <Form.Item name='surname' label='Surname' rules={[{ required: true, message: 'Please input the surname of employee' }]}>
              <Input>
              </Input>
            </Form.Item>
            <Form.Item name='workPosition' label='Work Position' rules={[{ required: true, message: 'Please input the work position of employee' }]}>
              <Select>
                <Option value={0}>{workPosition[0]}</Option>
                <Option value={1}>{workPosition[1]}</Option>
                <Option value={2}>{workPosition[2]}</Option>
                <Option value={3}>{workPosition[3]}</Option>
                <Option value={4}>{workPosition[4]}</Option>
                <Option value={5}>{workPosition[5]}</Option>
              </Select>
            </Form.Item>
            <Form.Item name='dateOfBirth' label='Date of Birth' rules={[{ required: true, message: 'Please input the birthday of employee' }]}>
              <DatePicker></DatePicker>
            </Form.Item>
          </Form>
        </Modal>
        <Header>
          <Row justify='start' align='middle'>
            <Col span={4}>
              <Search
                placeholder='Search'
                onSearch={onFilterTextBoxChange}
                style={{ verticalAlign: 'middle' }}
                allowClear
              />
            </Col>
            <Col span={4} offset={1}>
              <Button type='primary' style={{ verticalAlign: 'middle' }} onClick={() => {
                showRegModal();
              }}>Hire New Employee</Button>
            </Col>
          </Row>
        </Header>
        <Content className='content'>
          <div id='grid' className="ag-theme-alpine-dark" >
            <AgGridReact
              gridOptions={gridOptions}
              onGridReady= {onGridReady}
            />
          </div>
        </Content>
        <Footer className='footer'/>
      </Layout>
    </div>
  )
}
export default EmployeeList