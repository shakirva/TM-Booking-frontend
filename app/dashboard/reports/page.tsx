"use client";
import React, { useState, useEffect, useRef } from "react";
import { getToken } from "@/lib/auth";
import { formatDateDMY } from "@/lib/date";
import { FiPrinter, FiDownload, FiFilter, FiCalendar, FiTrendingUp, FiPieChart, FiBarChart2, FiTrash2 } from "react-icons/fi";
import { deleteBooking } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Booking {
  id: number;
  date: string;
  customer_name?: string;
  name?: string;
  phone?: string;
  customer_phone?: string;
  total_amount?: string | number;
  night?: string;
  advance_amount?: string | number;
  balance_amount?: number;
  utensil?: string;
  final_payment?: string | number;
  remarks?: string;
  time?: string;
  created_at?: string;
}

interface ChartData {
  monthly: Array<{ month: string; count: number; revenue: number }>;
  slots: Array<{ slot_name: string; count: number }>;
  night: Array<{ night: string; count: number }>;
}

interface ReportsSummary {
  total_bookings: number;
  total_revenue: number;
  total_advance: number;
  avg_booking_value: number;
}

interface ReportsData {
  bookings: Booking[];
  charts: ChartData;
  summary: ReportsSummary;
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReportsData | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const fetchReports = async () => {
    setLoading(true);
    const token = getToken();
    if (!token || !API_URL) {
      setLoading(false);
      return;
    }
    
    try {
      const params = new URLSearchParams();
      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);
      if (bookingDate) params.append("bookingDate", bookingDate);
      
      const res = await fetch(`${API_URL}/bookings/reports?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = () => {
    fetchReports();
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFromDate("");
    setToDate("");
    setBookingDate("");
    fetchReports();
    setShowFilters(false);
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Booking Report - TM Mahal</title>
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
            .summary { 
              display: flex; 
              justify-content: space-around; 
              margin-bottom: 20px;
              background: #f8fafc;
              padding: 15px;
              border-radius: 8px;
            }
            .summary-item { text-align: center; }
            .summary-item .value { 
              font-size: 18px; 
              font-weight: bold; 
              color: #1e40af;
            }
            .summary-item .label { 
              font-size: 10px; 
              color: #666; 
              text-transform: uppercase;
            }
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
            tr:hover { background: #e0e7ff; }
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
            <p>Event Booking Report</p>
            <p style="margin-top: 5px;">
              ${fromDate || toDate ? `Date Range: ${fromDate ? formatDateDMY(fromDate) : 'All'} - ${toDate ? formatDateDMY(toDate) : 'Present'}` : 'All Bookings'}
            </p>
            <p style="margin-top: 3px; color: #888;">Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
          ${data ? `
            <div class="summary">
              <div class="summary-item">
                <div class="value">${data.summary.total_bookings}</div>
                <div class="label">Total Bookings</div>
              </div>
              <div class="summary-item">
                <div class="value">₹${(data.summary.total_revenue || 0).toLocaleString()}</div>
                <div class="label">Total Revenue</div>
              </div>
              <div class="summary-item">
                <div class="value">₹${(data.summary.total_advance || 0).toLocaleString()}</div>
                <div class="label">Total Advance</div>
              </div>
              <div class="summary-item">
                <div class="value">₹${Math.round(data.summary.avg_booking_value || 0).toLocaleString()}</div>
                <div class="label">Avg. Booking Value</div>
              </div>
            </div>
          ` : ''}
          
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
              </tr>
            </thead>
            <tbody>
              ${data?.bookings.map(b => `
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
                </tr>
              `).join('') || '<tr><td colspan="10" class="text-center">No bookings found</td></tr>'}
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
    if (!data?.bookings.length) return;
    
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
      "Remarks"
    ];
    
    const rows = data.bookings.map(b => [
      b.date ? formatDateDMY(b.date) : "",
      b.customer_name || b.name || "",
      b.phone || b.customer_phone || "",
      parseFloat(String(b.total_amount)) || 0,
      b.night || "No",
      parseFloat(String(b.advance_amount)) || 0,
      b.balance_amount || 0,
      b.utensil || "",
      parseFloat(String(b.final_payment)) || 0,
      b.remarks || ""
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `booking-report-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // Simple bar chart component
  const BarChart = ({ data: chartData, label, valueKey, nameKey }: { 
    data: Array<Record<string, string | number>>; 
    label: string;
    valueKey: string;
    nameKey: string;
  }) => {
    const maxValue = Math.max(...chartData.map(d => Number(d[valueKey]) || 0), 1);
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiBarChart2 className="text-blue-600" />
          {label}
        </h4>
        <div className="space-y-3">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-24 text-sm text-gray-600 truncate">{String(item[nameKey])}</div>
              <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${(Number(item[valueKey]) / maxValue) * 100}%` }}
                >
                  <span className="text-xs text-white font-medium">{Number(item[valueKey])}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Simple pie chart display
  const PieChartDisplay = ({ data: chartData, label, nameKey, valueKey }: { 
    data: Array<Record<string, string | number>>; 
    label: string;
    nameKey: string;
    valueKey: string;
  }) => {
    const total = chartData.reduce((sum, d) => sum + (Number(d[valueKey]) || 0), 0);
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiPieChart className="text-green-600" />
          {label}
        </h4>
        <div className="flex items-center justify-center gap-8">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {chartData.reduce((acc: React.ReactElement[], item, index) => {
                const value = Number(item[valueKey]) || 0;
                const percentage = total > 0 ? (value / total) * 100 : 0;
                const previousPercentage = chartData
                  .slice(0, index)
                  .reduce((sum, d) => sum + (Number(d[valueKey]) / total) * 100, 0);
                
                const circumference = 2 * Math.PI * 40;
                const dashArray = (percentage / 100) * circumference;
                const dashOffset = (previousPercentage / 100) * circumference;
                
                acc.push(
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={colors[index % colors.length]}
                    strokeWidth="20"
                    strokeDasharray={`${dashArray} ${circumference}`}
                    strokeDashoffset={-dashOffset}
                  />
                );
                return acc;
              }, [])}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-800">{total}</span>
            </div>
          </div>
          <div className="space-y-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm text-gray-600">{String(item[nameKey])}</span>
                <span className="text-sm font-medium text-gray-800">({Number(item[valueKey])})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 text-sm mt-1">View and analyze booking data with charts and filters</p>
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
            Print Report
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
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm animate-in slide-in-from-top-2">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiCalendar className="text-blue-600" />
            Date Filters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date</label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 opacity-80 text-sm mb-1">
              <FiTrendingUp className="w-4 h-4" />
              Total Bookings
            </div>
            <div className="text-2xl font-bold">{data.summary.total_bookings}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 opacity-80 text-sm mb-1">
              Total Revenue
            </div>
            <div className="text-2xl font-bold">₹{(data.summary.total_revenue || 0).toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 opacity-80 text-sm mb-1">
              Total Advance
            </div>
            <div className="text-2xl font-bold">₹{(data.summary.total_advance || 0).toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 opacity-80 text-sm mb-1">
              Avg. Booking
            </div>
            <div className="text-2xl font-bold">₹{Math.round(data.summary.avg_booking_value || 0).toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.charts.monthly.length > 0 && (
            <BarChart 
              data={data.charts.monthly} 
              label="Monthly Bookings" 
              valueKey="count" 
              nameKey="month" 
            />
          )}
          {data.charts.slots.length > 0 && (
            <PieChartDisplay 
              data={data.charts.slots} 
              label="Bookings by Slot" 
              valueKey="count" 
              nameKey="slot_name" 
            />
          )}
          {data.charts.night.length > 0 && (
            <PieChartDisplay 
              data={data.charts.night} 
              label="Night Option Usage" 
              valueKey="count" 
              nameKey="night" 
            />
          )}
        </div>
      )}

      {/* Data Table */}
      <div ref={printRef} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Booking Details</h3>
          <p className="text-sm text-gray-500">Ordered by Event Date</p>
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
                <th className="py-3 px-4 text-center font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.bookings.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-gray-400">
                    No bookings found. Adjust your filters or create new bookings.
                  </td>
                </tr>
              )}
              {data?.bookings.map((booking) => (
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
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center">
                      <button
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Booking"
                        onClick={async () => {
                          if (!window.confirm('Are you sure you want to delete this booking?')) return;
                          const token = getToken();
                          if (!token) return;
                          try {
                            await deleteBooking(String(booking.id), token);
                            fetchReports();
                          } catch {
                            alert('Failed to delete booking.');
                          }
                        }}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
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
