import * as XLSX from 'xlsx';
import processarRedes from '../../utils/processarRedes';

const UploadRedes = ({ setDados }) => {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const instagram = XLSX.utils.sheet_to_json(workbook.Sheets['INSTAGRAM']);
      const facebook = XLSX.utils.sheet_to_json(workbook.Sheets['FACEBOOK']);
      const twitter = XLSX.utils.sheet_to_json(workbook.Sheets['TWITTER']);
      const planilha4 = XLSX.utils.sheet_to_json(workbook.Sheets['Planilha4']);

      const resultado = processarRedes(instagram, facebook, twitter, planilha4);
      setDados(resultado);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept=".xlsx"
        onChange={handleUpload}
        className="block w-full p-2 border rounded-md shadow-sm"
      />
    </div>
  );
};

export default UploadRedes;
