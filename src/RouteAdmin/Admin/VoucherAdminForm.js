import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VoucherAdminForm.css'; // Import CSS here

const VoucherAdminForm = () => {
  const [voucherName, setVoucherName] = useState('');
  const [idCateVoucher, setIdCateVoucher] = useState('');
  const [status, setStatus] = useState('Active');
  const [startDay, setStartDay] = useState('');
  const [endDay, setEndDay] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios.get('/api/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic date validation
    if (new Date(startDay) > new Date(endDay)) {
      setErrorMessage('Start date cannot be later than the end date.');
      return;
    }

    // Clear any previous error/success messages
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const voucherData = {
      voucherName,
      idCateVoucher,
      status,
      startDay,
      endDay
    };

    axios.post('/api/vouchers-admin', voucherData)
      .then(response => {
        setSuccessMessage('Voucher added successfully!');
        setVoucherName('');
        setIdCateVoucher('');
        setStatus('Active');
        setStartDay('');
        setEndDay('');
      })
      .catch(error => {
        setErrorMessage('Error adding voucher. Please try again.');
        console.error('Error adding voucher:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <h1>Add New Voucher</h1>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="voucherName">Voucher Name:</label>
          <input
            type="text"
            id="voucherName"
            value={voucherName}
            onChange={(e) => setVoucherName(e.target.value)}
            maxLength="150"
            required
          />
        </div>

        <div>
          <label htmlFor="idCateVoucher">Category:</label>
          <select
            id="idCateVoucher"
            value={idCateVoucher}
            onChange={(e) => setIdCateVoucher(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nameCategory}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        <div>
          <label htmlFor="startDay">Start Date:</label>
          <input
            type="date"
            id="startDay"
            value={startDay}
            onChange={(e) => setStartDay(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="endDay">End Date:</label>
          <input
            type="date"
            id="endDay"
            value={endDay}
            onChange={(e) => setEndDay(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Voucher'}
        </button>
      </form>
    </div>
  );
};

export default VoucherAdminForm;
