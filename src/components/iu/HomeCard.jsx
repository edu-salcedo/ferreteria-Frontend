import React from 'react'

export default function HomeCard({ img, title, description, price }) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 hover:-translate-y-2 transition-all duration-300 text-center">
            <img src={img} alt={title} className="w-full h-40 object-contain rounded-md mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600"> {description} </p>
            {price && <p className='text-gray-800 font-semibold'>${price}</p>}
        </div>
    )
}
