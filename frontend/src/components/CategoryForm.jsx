

const CategoryForm = ({value, setValue, handleSubmit, button='Submit', handleDelete}) => {
  return (
    <div className="p-3">
        <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" className="py-3 px-4 border rounded-lg w-full" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Write Category Name" />

            <div className="flex justify-between">
                <button className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
                    {button}
                </button>
                {handleDelete && 
                    <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" onClick={handleDelete}>
                        Delete
                    </button>
                }
            </div>
        </form>
    </div>
  )
}

export default CategoryForm
