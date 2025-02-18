import { useState } from "react"
import {useNavigate} from 'react-router-dom'
import { useCreateProductMutation, useUploadProductImageMutation } from "../../redux/api/productApiSlice"
import { useGetAllCategoriesQuery } from "../../redux/api/categoryApiSlice"
import { toast } from 'react-toastify'
import AdminMenu from "./AdminMenu"
const ProductList = () => {
    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [brand, setBrand] = useState('');
    const [stock, setStock] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();

    const [uploadProductImage] = useUploadProductImageMutation();
    const [createProduct] = useCreateProductMutation();
    const {data: categories} = useGetAllCategoriesQuery();

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        try {
            const data = await uploadProductImage(formData).unwrap();
            toast.success(data.message);
            setImage(data.image);
            setImageUrl(data.image);
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append('image', image);
            if(!name){
                toast.error("Name is required");
                return;
            }
            productData.append('name', name);
            if(!description){
                toast.error("Description is required");
                return;
            }
            productData.append('description', description);
            productData.append('price', price);
            if(!category){
                toast.error("Category is required");
                return;
            }
            productData.append('category', category);
            if(!quantity){
                toast.error("Quantity is required");
                return;
            }
            productData.append('quantity', quantity);
            if(!brand){
                toast.error("Brand is required");
                return;
            }
            productData.append('brand', brand);
            if(!stock){
                toast.error("Stock is required");
                return;
            }
            productData.append('countInStock', stock);

            const data = await createProduct(productData).unwrap();
            if(data.error){
                toast.error("Product creation failed");
            }
            else {
                toast.success(`Product ${data.name} created successfully`);
                navigate('/');
            }
           
        } catch (error) {
            console.log(error);
            toast.error("Creating product failed");
        }
    }
  return (
    <div className="container xl:mx-[9rem] sm:mx=[0]">
        <div className="flex flex-col md:flex-row">
            <AdminMenu />
            <div className="md:w-3/4 p-3">
                <div className="h-12 ml-3 font-semibold">Create Product</div>
                {imageUrl && (
                    <div className="text-center">
                        <img src={imageUrl} alt="product" className="block mx-auto max-h-[200px]" />
                    </div>
                )}

                <div className="mb-3 ml-3 w-[66rem]">
                    <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
                        {image ? image.name : 'Upload Image'}
                        <input type="file" name='image' accept='image/*' onChange={uploadFileHandler} className={!image ? 'hidden' : 'text-white'}/>
                    </label>
                </div>
                <div className="p-3">
                    <div className="flex flex-wrap">
                        <div className="one">
                            <label htmlFor="name" className="ml-1">Name</label> < br/>
                            <input type="text" className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white" value={name} onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className="two ml-22">
                            <label htmlFor="name block" className="ml-1">Price</label> < br/>
                            <input type="number" className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white" value={price} onChange={(e) => setPrice(e.target.value)}/>
                        </div>
                    </div>
                    <div className="flex flex-wrap">
                        <div className="one">
                            <label htmlFor="name block" className="ml-1">Quantity</label> < br/>
                            <input type="number" className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white" value={quantity} onChange={(e) => setQuantity(e.target.value)}/>
                        </div>
                        <div className="two ml-22">
                            <label htmlFor="name block" className="ml-1">Brand</label> < br/>
                            <input type="text" className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white" value={brand} onChange={(e) => setBrand(e.target.value)}/>
                        </div>
                    </div>

                    <label htmlFor="" className="my-5 ml-1">Description</label>
                    <textarea type="text" className="p-5 mb-3 bg-[#101011] border rounded-lg w-[95%] text-white" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    <div className="flex justify-between">
              <div>
                <label htmlFor="name block" className="ml-1">Count In Stock</label> <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div className="mr-14">
                <label htmlFor="" className="ml-1">Category</label> <br />
                <select
                  className="p-4 mb-3  w-[30rem] border rounded-lg bg-[#101011] text-white"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                >
                  <option value="" disabled>Choose Category</option>
                    {categories?.map((category) => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
              </div>
            </div>
                    <button onClick={handleSubmit} className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600">Submit</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProductList
