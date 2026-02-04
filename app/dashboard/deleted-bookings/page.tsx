"use client";
import { useEffect, useState, useRef } from 'react';
import { getDeletedBookings } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { formatDateDMY } from '@/lib/date';
import { FiPrinter, FiDownload, FiFilter, FiCalendar } from "react-icons/fi";

type DeletedBooking = {
  id: number;
  original_booking_id: number;
  name?: string;
  customer_name?: string;
  phone?: string;
  customer_phone?: string;
  groom_name?: string;
  bride_name?: string;
  address?: string;
  details?: string;
  occasion_type?: string;
  payment_mode?: string;
  advance_amount?: string;
  total_amount?: string;
  date?: string;
  time?: string;
  deleted_at?: string;
  created_at?: string;
  night?: string;
  utensil?: string;
  final_payment?: string;
  remarks?: string;
  balance_amount?: number;
};

export default function DeletedBookingsPage() {
  const [deleted, setDeleted] = useState<DeletedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDeleted = async () => {
      setLoading(true);
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await getDeletedBookings(token);
        if (Array.isArray(data)) {
          // Calculate balance and sort by event date
          const processedData = data.map((d: DeletedBooking) => ({
            ...d,
            balance_amount: (parseFloat(String(d.total_amount)) || 0) - (parseFloat(String(d.advance_amount)) || 0)
          }));
          processedData.sort((a: DeletedBooking, b: DeletedBooking) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateA - dateB;
          });
          setDeleted(processedData);
        } else {
          setDeleted([]);
        }
      } catch (err) {
        console.error('Failed to load deleted bookings:', err);
        setError('Failed to load deleted bookings');
        setDeleted([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDeleted();
  }, []);

  // Filter bookings
  const filteredBookings = deleted.filter(b => {
    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      const searchFields = [
        b.name,
        b.customer_name,
        b.groom_name,
        b.bride_name,
        b.phone,
        b.customer_phone,
        b.remarks
      ];
      const matches = searchFields.some(f => (f || '').toLowerCase().includes(q));
      if (!matches) return false;
    }
    
    // From date filter
    if (fromDate && b.date) {
      if (new Date(b.date) < new Date(fromDate)) return false;
    }
    
    // To date filter
    if (toDate && b.date) {
      if (new Date(b.date) > new Date(toDate)) return false;
    }
    
    return true;
  });

  const handleClearFilters = () => {
    setFromDate('');
    setToDate('');
    setSearch('');
    setShowFilters(false);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Event Log - TM Mahal</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              padding: 20px;
              font-size: 11px;
            }
            .header { 
              text-align: center; 
              margin-bottom: 20px; 
              border-bottom: 2px solid #1e40af;
              padding-bottom: 15px;
            }
            .header h1 { 
              color: #1e40af; 
              font-size: 24px;
              margin-bottom: 5px;
            }
            .header p { color: #666; font-size: 12px; }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 10px;
              font-size: 10px;
            }
            th { 
              background: #1e40af; 
              color: white; 
              padding: 10px 6px; 
              text-align: left;
              font-weight: 600;
            }
            td { 
              padding: 8px 6px; 
              border-bottom: 1px solid #e5e7eb;
            }
            tr:nth-child(even) { background: #f8fafc; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .footer { 
              margin-top: 30px; 
              text-align: center; 
              font-size: 10px; 
              color: #666;
              border-top: 1px solid #e5e7eb;
              padding-top: 15px;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TM MAHAL</h1>
            <p>Event Log (Deleted Bookings)</p>
            <p style="margin-top: 5px;">
              ${fromDate || toDate ? `Date Range: ${fromDate ? formatDateDMY(fromDate) : 'All'} - ${toDate ? formatDateDMY(toDate) : 'Present'}` : 'All Bookings'}
            </p>
            <p style="margin-top: 3px; color: #888;">Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Event Date</th>
                <th>Customer Name</th>
                <th>Phone</th>
                <th class="text-right">Total Amt</th>
                <th class="text-center">Night</th>
                <th class="text-right">Advance</th>
                <th class="text-right">Balance</th>
                <th>Utensil</th>
                <th class="text-right">Final Pay</th>
                <th>Remarks</th>
                <th>Deleted At</th>
              </tr>
            </thead>
            <tbody>
              ${filteredBookings.map(b => `
                <tr>
                  <td>${b.date ? formatDateDMY(b.date) : '-'}</td>
                  <td>${b.customer_name || b.name || '-'}</td>
                  <td>${b.phone || b.customer_phone || '-'}</td>
                  <td class="text-right">₹${(parseFloat(String(b.total_amount)) || 0).toLocaleString()}</td>
                  <td class="text-center">${b.night || 'No'}</td>
                  <td class="text-right">₹${(parseFloat(String(b.advance_amount)) || 0).toLocaleString()}</td>
                  <td class="text-right">₹${(b.balance_amount || 0).toLocaleString()}</td>
                  <td>${b.utensil || '-'}</td>
                  <td class="text-right">${b.final_payment ? `₹${parseFloat(String(b.final_payment)).toLocaleString()}` : '-'}</td>
                  <td>${b.remarks || '-'}</td>
                  <td>${b.deleted_at ? formatDateDMY(b.deleted_at) : '-'}</td>
                </tr>
              `).join('') || '<tr><td colspan="11" class="text-center">No deleted bookings found</td></tr>'}
            </tbody>
          </table>
          
          <div class="footer">
            <p>This is a computer-generated report. No signature required.</p>
            <p style="margin-top: 5px;">© ${new Date().getFullYear()} TM Mahal - Event Booking Management System</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleExportCSV = () => {
    if (!filteredBookings.length) return;
    
    const headers = [
      "Event Date",
      "Customer Name",
      "Phone",
      "Total Amount",
      "Night",
      "Advance Amount",
      "Balance Amount",
      "Utensil",
      "Final Payment",
      "Remarks",
      "Deleted At"
    ];
    
    const rows = filteredBookings.map(b => [
      b.date ? formatDateDMY(b.date) : "",
      b.customer_name || b.name || "",
      b.phone || b.customer_phone || "",
      parseFloat(String(b.total_amount)) || 0,
      b.night || "No",
      parseFloat(String(b.advance_amount)) || 0,
      b.balance_amount || 0,
      b.utensil || "",
      parseFloat(String(b.final_payment)) || 0,
      b.remarks || "",
      b.deleted_at ? formatDateDMY(b.deleted_at) : ""
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `event-log-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading event log...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Log</h1>
          <p className="text-gray-500 text-sm mt-1">View all booking history ordered by event date</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
          >
            <FiFilter className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            <FiPrinter className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
          >
            <FiDownload className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiCalendar className="text-blue-600" />
            Filters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Name, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date (Event)</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date (Event)</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

      {/* Mobile card list */}
      <div className="space-y-3 md:hidden">
        {filteredBookings.map(b => (
          <div
            key={b.id}
            className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-red-500 font-medium">Deleted</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                b.night === 'Yes' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}>
                Night: {b.night || 'No'}
              </span>
            </div>
            
            {/* Main info */}
            <div className="mb-3">
              <div className="font-semibold text-gray-900">{b.customer_name || b.name || '-'}</div>
              <div className="text-sm text-gray-600">{b.phone || b.customer_phone || '-'}</div>
            </div>
            
            {/* Details grid */}
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="text-gray-500">Event Date</span>
                <div className="font-medium text-gray-900">{b.date ? formatDateDMY(b.date) : '-'}</div>
              </div>
              <div>
                <span className="text-gray-500">Total</span>
                <div className="font-medium text-gray-900">₹{(parseFloat(String(b.total_amount)) || 0).toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-500">Advance</span>
                <div className="font-medium text-gray-900">₹{(parseFloat(String(b.advance_amount)) || 0).toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-500">Balance</span>
                <div className="font-medium text-amber-600">₹{(b.balance_amount || 0).toLocaleString()}</div>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Deleted At</span>
                <div className="font-medium text-red-600">{b.deleted_at ? formatDateDMY(b.deleted_at) : '-'}</div>
              </div>
            </div>
            
            {b.remarks && (
              <div className="text-sm text-gray-500 truncate">
                <span className="font-medium">Remarks:</span> {b.remarks}
              </div>
            )}
          </div>
        ))}
        {filteredBookings.length === 0 && (
          <div className="text-center py-8 text-gray-400">No deleted bookings found</div>
        )}
      </div>

      {/* Desktop Data Table */}
      <div ref={printRef} className="bg-white rounded-xl border border-gray-200 overflow-hidden hidden md:block">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Booking Details</h3>
          <p className="text-sm text-gray-500">Ordered by Event Date • {filteredBookings.length} records</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Event Date</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Customer Name</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Phone</th>
                <th className="py-3 px-4 text-right font-semibold text-gray-700">Total Amt</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700">Night</th>
                <th className="py-3 px-4 text-right font-semibold text-gray-700">Advance</th>
                <th className="py-3 px-4 text-right font-semibold text-gray-700">Balance</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Utensil</th>
                <th className="py-3 px-4 text-right font-semibold text-gray-700">Final Pay</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Remarks</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Deleted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-gray-400">
                    No deleted bookings found.
                  </td>
                </tr>
              )}
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-900 font-medium">
                    {booking.date ? formatDateDMY(booking.date) : '-'}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{booking.customer_name || booking.name || '-'}</td>
                  <td className="py-3 px-4 text-gray-700">{booking.phone || booking.customer_phone || '-'}</td>
                  <td className="py-3 px-4 text-right text-gray-900 font-medium">
                    ₹{(parseFloat(String(booking.total_amount)) || 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      booking.night === 'Yes' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {booking.night || 'No'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700">
                    ₹{(parseFloat(String(booking.advance_amount)) || 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-amber-600 font-medium">
                    ₹{(booking.balance_amount || 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{booking.utensil || '-'}</td>
                  <td className="py-3 px-4 text-right text-green-600 font-medium">
                    {booking.final_payment ? `₹${parseFloat(String(booking.final_payment)).toLocaleString()}` : '-'}
                  </td>
                  <td className="py-3 px-4 text-gray-500 max-w-[150px] truncate" title={booking.remarks || ''}>
                    {booking.remarks || '-'}
                  </td>
                  <td className="py-3 px-4 text-red-600 font-medium">
                    {booking.deleted_at ? formatDateDMY(booking.deleted_at) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
