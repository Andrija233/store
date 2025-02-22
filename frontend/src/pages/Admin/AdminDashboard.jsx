import { useState, useEffect, use } from 'react';
import Chart from 'react-apexcharts';
import { useGetUsersQuery } from '../../redux/api/usersApiSlice';
import { useGetTotalOrdersQuery, useGetTotalSalesByDateQuery, useGetTotalSalesQuery } from '../../redux/api/orderApiSlice';
import AdminMenu from './AdminMenu';
import OrderList from './OrderList';
import Loader from '../../components/Loader';

const AdminDashboard = () => {
    const {data: sales, isLoading} = useGetTotalSalesQuery();
    const { data: customers, isLoading: isLoadingCustomers } = useGetUsersQuery();
    const {data: orders, isLoading: isLoadingOrders} = useGetTotalOrdersQuery();
    const {data: salesByDate, isLoading: isLoadingSalesByDate} = useGetTotalSalesByDateQuery();

    const [state, setState] = useState({
        options: {
            chart:{
                type: 'line',
            },
            tooltip:{
                theme: 'dark'
            },
            colors: ['#00e396'],
            dataLabels: {
                enabled: true,
            },
            stroke: {
                curve: 'smooth',
            },
            title:{
                text: 'Sales Over Time',
                align: 'left',
            },
            grid : {
                borderColor: '#ccc',
            },
            markers :{
                size: 1
            },
            xaxis: {
                categories: [],
                title : {
                    text: 'Date'
                }
            },
            yaxis: {
                title : {
                    text: 'Sales'
                },
                min: 0
            },
            legend : {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
            },
        },
        series: [
            {
                name: 'Sales',
                data: [],
            },
        ],
    });

    useEffect(() => {
        if(salesByDate){
            // formate the data from salesByDate to match the chart's requirements
            const formattedSalesByDate = salesByDate.map((sale) => ({
                x: sale._id,
                y: sale.totalSales
            }));

            setState((prevState) => ({
                ...prevState,
                options: {
                    ...prevState.options,
                    xaxis: {
                        categories: formattedSalesByDate.map((sale) => sale.x),
                    }
                },
                series: [
                    {
                        name: 'Sales',
                        data: formattedSalesByDate.map((sale) => sale.y),
                    },
                ],
            }))
        }
    }, [salesByDate]);
  return (
    <>
      <AdminMenu />

      <section className="xl:ml-[4rem] md:ml-[0rem]">
        <div className="w-[80%] flex justify-around flex-wrap">
          <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
              $
            </div>

            <p className="mt-5">Sales</p>
            <h1 className="text-xl font-bold">
              $ {isLoading ? <Loader /> : sales.totalSales}
            </h1>
          </div>
          <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
              $
            </div>

            <p className="mt-5">Customers</p>
            <h1 className="text-xl font-bold">
              $ {isLoading ? <Loader /> : customers?.length}
            </h1>
          </div>
          <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
              $
            </div>

            <p className="mt-5">All Orders</p>
            <h1 className="text-xl font-bold">
              $ {isLoading ? <Loader /> : orders?.totalOrders}
            </h1>
          </div>
        </div>

        <div className="ml-[10rem] mt-[4rem]">
          <Chart options={state.options} series={state.series} type="line" width="70%" />
        </div>

        <div className="mt-[4rem]">
          <OrderList />
        </div>
      </section>
    </>
  )
}

export default AdminDashboard
