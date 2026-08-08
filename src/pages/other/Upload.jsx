import React from 'react';
import ExcelUploader from '../../components/features/ExcelUploader.jsx';
import ExcelUploaderOrders from '../../components/features/ExcelUploaderOrders.jsx';

const Upload = () => {
    return (
        <div className='flex '>
            <ExcelUploader />
            <ExcelUploaderOrders />
        </div>
    );
};

export default Upload;