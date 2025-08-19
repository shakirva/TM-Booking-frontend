import React, { useEffect, useState } from 'react';
import { Booking } from './booking/BookingDataProvider';

interface BookingCardsProps {
  date: Date | null;
  bookings: Booking[];
  onEditBooking: (booking: Booking) => void;
}

const BookingCards: React.FC<BookingCardsProps> = ({ date, bookings, onEditBooking }) => {
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (date) {
      setFormattedDate(date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
    }
  }, [date]);

  if (!date || bookings.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {isClient ? formattedDate : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`}
        </h3>
      </div>
      
      <div className="space-y-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
            onClick={() => onEditBooking(booking)}
          >
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 w-20">Customer:</span>
                <span className="text-sm text-gray-900">{booking.customerName}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 w-20">Phone:</span>
                <span className="text-sm text-gray-900">{booking.customerPhone}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 w-20">Occasion:</span>
                <span className="text-sm text-gray-900">{booking.occasion}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingCards; 