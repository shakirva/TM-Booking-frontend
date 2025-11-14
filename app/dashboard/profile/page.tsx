export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-4 md:p-6">
      <h1 className="text-xl font-bold mb-4">Profile</h1>
      <div className="space-y-4 text-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
          <span className="text-gray-500">Name</span>
          <span className="font-medium text-black">John Doe</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
          <span className="text-gray-500">Role</span>
          <span className="font-medium text-black">Admin</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
          <span className="text-gray-500">Email</span>
          <span className="font-medium text-black">example@mail.com</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
          <span className="text-gray-500">Joined</span>
          <span className="font-medium text-black">Jan 01, 2025</span>
        </div>
      </div>
    </div>
  );
}