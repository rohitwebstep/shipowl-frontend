'use client';
import { useContext, useEffect, useState ,useCallback} from 'react';
import { ProfileEditContext } from './ProfileEditContext';
import profileImg from '@/app/images/editprofile.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Pencil } from 'lucide-react';
const ProfileEdit = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { formData, setFormData,fetchCountry, stateData,cityData, setCityData, setStateData,setActiveTab,countryData} = useContext(ProfileEditContext);
    const [errors, setErrors] = useState({});
    const [previewUrl, setPreviewUrl] = useState(null);
    const fetchCity = useCallback(async (id) => {
        const adminData = JSON.parse(localStorage.getItem("shippingData"));
        if (adminData?.project?.active_panel !== "admin") {
            localStorage.removeItem("shippingData");
            router.push("/admin/auth/login");
            return;
        }

        const admintoken = adminData?.security?.token;
        if (!admintoken) {
            router.push("/admin/auth/login");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3001/api/location/state/${formData?.permanentState||id}/cities`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${admintoken}`,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                Swal.fire({
                    icon: "error",
                    title: "Something Wrong!",
                    text: result.message || result.error || "Your session has expired. Please log in again.",
                });
                throw new Error(result.message || result.error || "Something Wrong!");
            }

            setCityData(result?.cities || []);
            setStateData(result?.states || []);
        } catch (error) {
            console.error("Error fetching cities:", error);
        } finally {
            setLoading(false);
        }
    }, [router]);
    const fetchState = useCallback(async (id) => {
      console.log('id',id)
        const adminData = JSON.parse(localStorage.getItem("shippingData"));
        
        if (adminData?.project?.active_panel !== "admin") {
          localStorage.removeItem("shippingData");
          router.push("/admin/auth/login");
          return;
        }
      
        const admintoken = adminData?.security?.token;
        if (!admintoken) {
          router.push("/admin/auth/login");
          return;
        }
      
        try {
          setLoading(true);
          const response = await fetch(
            `http://localhost:3001/api/location/country/${ formData?.permanentCountry|| id}/states`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${admintoken}`,
              },
            }
          );
      
          const result = await response.json();
      
          if (!response.ok) {
            Swal.fire({
              icon: "error",
              title: "Something went wrong!",
              text: result.message || result.error || "Your session has expired. Please log in again.",
            });
            throw new Error(result.message || result.error || "Something Wrong!");
          }
      
          setStateData(result?.states || []);
        } catch (error) {
          console.error("Error fetching states:", error); // <- corrected message: "states" instead of "cities"
        } finally {
          setLoading(false);
        }
      }, [router]);
      

      const handleChange = (e) => {
        const { name, value, files } = e.target;
        let updatedFormData = { ...formData };
    
        if (files?.length) {
            const file = files[0];
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
    
            updatedFormData[name] = file; // Set the file in formData
        } else {
            updatedFormData[name] = value;
            if (name === "profilePicture") {
                setPreviewUrl(null); // Remove preview if profilePicture is not selected
            }
        }
    
        setFormData(updatedFormData); // Update the form data with the new file or value
    
        if (name === "permanentCountry" && value) {
            fetchState(value);
        }
        if (name === "permanentState" && value) {
            fetchCity(value);
        }
    
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };
    
    
    
    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Full Name is required';
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
        if (!formData.currentAddress) newErrors.currentAddress = 'Present Address is required';
        if (!formData.permanentAddress) newErrors.permanentAddress = 'Permanent Address is required';
        if (!formData.permanentCity) newErrors.permanentCity = 'City is required';
        if (!formData.permanentPostalCode) newErrors.permanentPostalCode = 'Postal Code is required';
        if (!formData.permanentCountry) newErrors.permanentCountry = 'Country is required';
        if (!formData.permanentState) newErrors.permanentState = 'State is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            setActiveTab('business-info');
        }
    };

    useEffect(() => {
        fetchCountry();
    }, [fetchCountry]);

    const inputClasses = (field) =>
        `w-full p-3 border rounded-lg font-bold ${
            errors[field] ? 'border-red-500 text-red-500' : 'border-[#DFEAF2] text-[#718EBF]'
        }`;

    const labelClasses = (field) =>
        `block font-bold mb-1 ${errors[field] ? 'text-red-500' : 'text-[#232323]'}`;

    const handleCancel = () => {
        setErrors({});
    };

    return (
        <div className='md:flex gap-4 xl:w-10/12 py-10 bg-white rounded-tl-none rounded-tr-none p-3 xl:p-10 rounded-2xl'>
            <div className='md:w-2/12'>
            <div className="relative edit-img p-5 w-48 h-48">
            <Image
  src={previewUrl || profileImg}
  alt="Profile image"
  width={192}
  height={192}
  className="w-full h-full object-cover rounded-full"
/>


  {/* Hidden input */}
  <input
    type="file"
    id="upload"
    name="profilePicture"
    accept="image/*"
    onChange={handleChange}
    className="hidden"
  />

  {/* Edit Icon */}
  <label
    htmlFor="upload"
    className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer"
  >
    <Pencil size={18} className="text-gray-600" />
  </label>
</div>

            </div>

            <div className="md:w-10/12">
  <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
    {/* Basic Inputs */}
    {[
      { label: 'Your Name', name: 'name', type: 'text' },
      { label: 'User Name', name: 'username', type: 'text' },
      { label: 'Email', name: 'email', type: 'email' },
      { label: 'Password', name: 'password', type: 'password' },
      { label: 'Date of Birth', name: 'dateOfBirth', type: 'date' },
      { label: 'Present Address', name: 'currentAddress', type: 'text' },
      { label: 'Permanent Address', name: 'permanentAddress', type: 'text' },
      { label: 'Postal Code', name: 'permanentPostalCode', type: 'text' },
    ].map(({ label, name, type }) => (
      <div key={name}>
        <label className={labelClasses(name)}>
          {label} <span className="text-red-500">*</span>
        </label>
        <input
          type={type}
          name={name}
          value={formData[name] || ''}
          onChange={handleChange}
          className={inputClasses(name)}
        />
        {errors[name] && (
          <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
        )}
      </div>
    ))}

    {/* Country Select */}
    <div>
      <label className={labelClasses('permanentCountry')}>
        Country <span className="text-red-500">*</span>
      </label>
      <select
        name="permanentCountry"
        value={formData.permanentCountry || ''}
        onChange={handleChange}
        className={inputClasses('permanentCountry')}
      >
        <option value="">Select Country</option>
        {countryData.map((country) => (
          <option key={country.id} value={country.id}>
            {country.name}
          </option>
        ))}
      </select>
      {errors.permanentCountry && (
        <p className="text-red-500 text-sm mt-1">{errors.permanentCountry}</p>
      )}
    </div>

    {/* State Select */}
    <div>
      <label className={labelClasses('permanentState')}>
        State <span className="text-red-500">*</span>
      </label>
      <select
        name="permanentState"
        value={formData.permanentState || ''}
        onChange={handleChange}
        className={inputClasses('permanentState')}
      >
        <option value="">Select State</option>
        {stateData.map((state) => (
          <option key={state.id} value={state.id}>
            {state.name}
          </option>
        ))}
      </select>
      {errors.permanentState && (
        <p className="text-red-500 text-sm mt-1">{errors.permanentState}</p>
      )}
    </div>

    {/* City Select */}
    <div>
      <label className={labelClasses('permanentCity')}>
        City <span className="text-red-500">*</span>
      </label>
      <select
        name="permanentCity"
        value={formData.permanentCity || ''}
        onChange={handleChange}
        className={inputClasses('permanentCity')}
      >
        <option value="">Select City</option>
        {cityData.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>
      {errors.permanentCity && (
        <p className="text-red-500 text-sm mt-1">{errors.permanentCity}</p>
      )}
    </div>
  </div>

  {/* Buttons */}
  <div className="flex space-x-4 mt-6">
    <button
      type="button"
      onClick={handleSubmit}
      className="px-4 py-2 bg-orange-500 text-white rounded-lg"
    >
      Next
    </button>
    <button
      type="button"
      onClick={handleCancel}
      className="px-4 py-2 bg-gray-400 text-white rounded-lg"
    >
      Cancel
    </button>
  </div>
</div>

        </div>
    );
};

export default ProfileEdit;
