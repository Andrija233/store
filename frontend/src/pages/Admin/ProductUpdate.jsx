import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useGetProductByIdQuery, useUpdateProductMutation, useDeleteProductMutation, useUploadProductImageMutation } from "../../redux/api/productApiSlice"
import { useGetAllCategoriesQuery } from "../../redux/api/categoryApiSlice"
import { toast } from "react-toastify"
import AdminMenu from "./AdminMenu"

const ProductUpdate = () => {
    const params = useParams();

    const {data: productData} = useGetProductByIdQuery(params._id);
    const [image,setImage] = useState(productData?.image || "");
    const [name,setName] = useState(productData?.name || "");
    const [description,setDescription] = useState(productData?.description || "");
    const [price,setPrice] = useState(productData?.price || "");
    const [category,setCategory] = useState(productData?.category || "");
    const [quantity,setQuantity] = useState(productData?.quantity || "");
    const [brand,setBrand] = useState(productData?.brand || "");
    const [stock,setStock] = useState(productData?.countInStock || 0);
    

    const navigate = useNavigate();

    const {data: categories} = useGetAllCategoriesQuery();
    const [uploadProductImage] = useUploadProductImageMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    useEffect(() => {
        if(productData && productData._id){
            setName(productData.name);
            setDescription(productData.description);
            setPrice(productData.price);
            setCategory(productData.categories?._id);
            setQuantity(productData.quantity);
            setBrand(productData.brand);
            setStock(productData.countInStock);
            setImage(productData.image);
        }
    }, [productData]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);
        try {
          const res = await uploadProductImage(formData).unwrap();
          toast.success("Image updated successfully");
          setImage(res.image);
        } catch (err) {
          toast.success("Picture updated successfully");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const formData = new FormData();
          formData.append("image", image);
          if(!name){
            toast.error("Name is required");
            return;
          }
          formData.append("name", name);
          if(!description){
            toast.error("Description is required");
            return;
          }
          formData.append("description", description);
          if(!price){
            toast.error("Price is required");
            return;
          }
          formData.append("price", price);
          if(!category){
            toast.error("Category is required");
            return;
          }
          formData.append("category", category);
          if(!quantity){
            toast.error("Quantity is required");
            return;
          }
          formData.append("quantity", quantity);
          if(!brand){
            toast.error("Brand is required");
            return;
          }
          formData.append("brand", brand);
          if(!stock){
            toast.error("Stock is required");
            return;
          }
          formData.append("countInStock", stock);
    
          // Update product using the RTK Query mutation
          const data = await updateProduct({ productId: params._id, formData });
    
          if (data?.error) {
            toast.error(data.error);
          } else {
            toast.success(`Product successfully updated`);
            navigate("/admin/allproductslist");
          }
        } catch (err) {
          console.log(err);
          toast.error("Product update failed. Try again.");
        }
    };

    const handleDelete = async () => {
        try {
          let answer = window.confirm(
            "Are you sure you want to delete this product?"
          );
          if (!answer) return;
    
          const { data } = await deleteProduct(params._id);
          toast.success(`"${data.name}" is deleted`);
          navigate("/admin/allproductslist");
        } catch (err) {
          console.log(err);
          toast.error("Delete failed. Try again.");
        }
    };
  return (
    <>
      <div className="container  xl:mx-[9rem] sm:mx-[0]">
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
          <div className="md:w-3/4 p-3">
            <div className="h-12 font-semibold">Update / Delete Product</div>

            {image && (
              <div className="text-center">
                <img
                  src={image}
                  alt="product"
                  className="block mx-auto w-full h-[40%]"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
                {image ? image.name : "Upload image"}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="text-white"
                />
              </label>
            </div>

            <div className="p-3">
              <div className="flex flex-wrap">
                <div className="one">
                  <label htmlFor="name">Name</label> <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white mr-[5rem]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="two">
                  <label htmlFor="name block">Price</label> <br />
                  <input
                    type="number"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white "
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap">
                <div>
                  <label htmlFor="name block">Quantity</label> <br />
                  <input
                    type="number"
                    min="1"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white mr-[5rem]"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="name block">Brand</label> <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white "
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
              </div>

              <label htmlFor="" className="my-5">
                Description
              </label>
              <textarea
                type="text"
                className="p-2 mb-3 bg-[#101011]  border rounded-lg w-[94%] text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="flex justify-between">
                <div>
                  <label htmlFor="name block">Count In Stock</label> <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white "
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                <div className="ml-20">
                  <label htmlFor="">Category</label> <br />
                  <select
                    placeholder="Choose Category"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white mr-[5rem]"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                  >
                    {categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <button
                  onClick={handleSubmit}
                  className="py-4 px-10 mt-5 rounded-lg text-lg font-bold  bg-green-600 mr-6 cursor-pointer hover:bg-green-700"
                >
                  Update
                </button>
                <button
                  onClick={handleDelete}
                  className="py-4 px-10 mt-5 rounded-lg text-lg font-bold  bg-pink-600 cursor-pointer hover:bg-pink-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductUpdate
