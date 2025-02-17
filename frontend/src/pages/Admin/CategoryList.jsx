import { useState } from "react"
import { toast } from "react-toastify"
import { useCreateCategoryMutation, useGetAllCategoriesQuery, useGetCategoryByIdQuery, useUpdateCategoryMutation, useDeleteCategoryMutation } from "../../redux/api/categoryApiSlice"
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";

const CategoryList = () => {
    const {data: categories, isLoading, isSuccess, isError, error} = useGetAllCategoriesQuery();
    const [name, setName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [updateName, setUpdateName] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if(!name) {
            toast.error("Category name is required");
            return;
        }
        try {
            const res = await createCategory({name}).unwrap();
            if(res.error){
                toast.error(res.error);
            }
            else {
                setName("");
                toast.success(`Category ${res.name} created successfully`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Creating category failed");
        }
    }

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        if(!updateName) {
            toast.error("Category name is required");
            return;
        }
        try {
            const res = await updateCategory({
                categoryId: selectedCategory._id,
                data: {
                  name: updateName,
                },
            }).unwrap();
            if(res.error){
                toast.error(res.error);
            }
            else {
                toast.success(`Category ${res.name} updated successfully`);
                setUpdateName("");
                setModalVisible(false);
                setSelectedCategory(null);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteCategory = async () => {
        try {
            const res = await deleteCategory(selectedCategory._id).unwrap();
            if(res.error){
                toast.error(res.error);
            }
            else {   
                toast.success(`Category ${res.name} deleted successfully`);
                setModalVisible(false);
                setSelectedCategory(null);
            }
        } catch (error) {
            console.error(error);
            toast.error("Deleting category failed");
        }
    }
  return (
    <div className="ml-[10rem] flex flex-col md:flex-row">
      {/* <AdminMenu /> */}
      <div className="md:w-3/4 p-3">
        <div className="h-12 ml-4">Manage Categories</div>
        <CategoryForm value={name} setValue={setName} handleSubmit={handleCreateCategory} />
        <br />
        <hr />

        <div className="flex flex-wrap">
          {categories?.map((category) => (
            <div key={category._id}>
              <button
                className="bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-lg m-3 hover:bg-pink-500 hover:text-white focus:outline-none foucs:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                onClick={() => {{
                    setModalVisible(true);
                    setSelectedCategory(category);
                    setUpdateName(category.name);
                  }
                }}
              >
                {category.name}
              </button>
            </div>
          ))}
        </div>
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
            <CategoryForm value={updateName} setValue={value => setUpdateName(value)} handleSubmit={handleUpdateCategory} button="Update" handleDelete={handleDeleteCategory} />
        </Modal>
      </div>
    </div>
  )
}

export default CategoryList
