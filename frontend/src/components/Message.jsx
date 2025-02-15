import React from 'react'

const Message = ({variant, children}) => {
    const getVariantClass = () => {
        switch (variant) {
            case 'success':
                return 'bg-green-100 border-green-400 text-green-800';
            case 'error':
                return 'bg-red-100 border-red-400 text-red-800';
            case 'warning':
                return 'bg-yellow-100 border-yellow-400 text-yellow-800';
            case 'info':
                return 'bg-blue-100 border-blue-400 text-blue-800';
            default:
                return 'bg-gray-100 border-gray-400 text-gray-800';
        }
    }
  return (
    <div className={`p-4 rounded ${getVariantClass()}`}>
      {children}
    </div>
  )
}

export default Message;
