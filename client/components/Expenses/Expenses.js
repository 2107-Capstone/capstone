import React, { forwardRef } from "react";
import { useSelector } from "react-redux";
import MaterialTable from 'material-table';

import { format, parseISO } from "date-fns";

import AddBox from '@mui/icons-material/AddBox';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Check from '@mui/icons-material/Check';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Edit from '@mui/icons-material/Edit';
import FilterList from '@mui/icons-material/FilterList';
import FirstPage from '@mui/icons-material/FirstPage';
import LastPage from '@mui/icons-material/LastPage';
import Remove from '@mui/icons-material/Remove';
import SaveAlt from '@mui/icons-material/SaveAlt';
import Search from '@mui/icons-material/Search';
import Delete from '@mui/icons-material/Delete';
import ViewColumn from '@mui/icons-material/ViewColumn';

export const Expenses = ({tripId}) => {
    const expenses = useSelector(state => state.expenses.filter(expense => expense.tripId === tripId).sort((a,b) => a.datePaid < b.datePaid ? -1 : 1));

    // const tableIcons = {
    //     Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    //     Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    //     DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    //     Delete: forwardRef((props, ref) => <Delete {...props} ref={ref} /> ),
    //     Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    //     Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    //     Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    //     FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    //     LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    //     NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    //     PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    //     ResetSearch: forwardRef((props, ref) => ''),
    //     Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    //     SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    //     ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    //     ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
    // };

    // const columns = [
    //     { title: 'Description', field: 'name',
    //         cellStyle: {
    //             width: 20,
    //             maxWidth: 20,
    //         },
    //         headerStyle: {
    //             width: 20,
    //             maxWidth: 20
    //         }
    //     },
    //     { title: 'Amount', field: 'amount', type: 'currency' },
    //     { title: 'Category', field: 'category' },
    //     { title: 'Paid By', field: 'paidBy' },
    //     { title: 'Date Paid', field: 'datePaid', type: 'date' }
    // ];
    // const data = expenses.map( expense => (
    //     {
    //         name: expense.name,
    //         amount: expense.amount,
    //         category: expense.category.name,
    //         paidBy: expense.paidBy.username,
    //         datePaid: expense.datePaid,
    //         id: expense.id
    //     }
    // ));

    if (tripId) {
        if (expenses.length === 0) return "No expenses"
    } else {
        if (expenses.length === 0) return "...loading"
    }
        return (
        //     <MaterialTable
        //     title='Expenses'
        //     icons={tableIcons}
        //     columns={columns}
        //     data={data}
        //     options={{
        //         filtering: true,
        //         grouping: true,
        //         search: true,
        //         toolbarButtonAlignment: 'left',
        //         pageSize: 10,
        //         pageSizeOptions: [10, 20, 30],
        //         headerStyle: {
        //             color: 'darkslate',
        //             background: '#D7EBF8',
        //         }
        //     }}
        //     style={{
        //         margin: '1rem',
        //     }}
            
        // />
            <ol>
                {
                  expenses.map(expense => (
                    <li key={expense.id + Math.random().toString(16)}>
                        ({format(parseISO(expense.datePaid), 'P')}): {expense.name}: ${(+expense.amount).toFixed(2)}
                        <br></br>
                        Paid By: {expense.paidBy.username}
                    </li>
                  ))
                }
            </ol>
        )
}