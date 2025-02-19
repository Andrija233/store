import { useGetTopProductsQuery } from "../redux/api/productApiSlice"
import Loader from "./Loader";
import OneProduct from "../pages/Products/OneProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
    const {data, isLoading, error} = useGetTopProductsQuery();

    if(isLoading) return <Loader />;

    if(error) {
        return <h1>Something went wrong</h1>;
    }
  return (
    <>
        <div className="flex justify-around">
            <div className="xl:block lg:hidden md:hidden sm:hidden">
                <div className="grid grid-cols-2 ml-[9rem]">
                    {data.map((product) => (
                        <div key={product._id}>
                            <OneProduct product={product} />
                        </div>
                    ))}
                </div>
            </div>
            <ProductCarousel />
        </div>
    </>
  )
}

export default Header
