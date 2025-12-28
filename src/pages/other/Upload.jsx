import React from 'react';
import ExcelUploader from '../../components/features/ExcelUploader.jsx';
import PdfUploader from '../../components/features/PdfUploader.jsx';

const Upload = () => {
    return (
        <div className='flex '>
            <ExcelUploader />
            <PdfUploader />
        </div>
    );
};

export default Upload;