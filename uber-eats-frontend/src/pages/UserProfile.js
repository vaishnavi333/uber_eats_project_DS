import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Form, Button, Alert, Image, Row, Col } from 'react-bootstrap';
import api, { endpoints } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Select from 'react-select';
import './UserProfile.css'; 
import { useLocation } from 'react-router-dom';


// Functional component for user profile management
function UserProfile() {
  const { state } = useLocation(); // Get state from location to access any passed data
  const [profile, setProfile] = useState(''); // State to hold user profile data
  const [loading, setLoading] = useState(true); // State to indicate loading status
  const [error, setError] = useState(''); // State to hold error messages
  const [updateSuccess, setUpdateSuccess] = useState(false); // State to indicate successful update
  const [profilePicture, setProfilePicture] = useState(null); // State to hold selected profile picture
  const { user } = useContext(AuthContext); // Access user information from AuthContext
  const [countries, setCountries] = useState([]); // State to hold country list for dropdown

  // Fetch the list of countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch(
        "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
      );
      const result = await response.json(); // Parse response as JSON
      console.log(result);
      setCountries(result.countries); // Set countries state with fetched data
    };
    fetchCountries(); // Call function to fetch countries
  }, []);

  // Fetch user profile data from the API
  const fetchProfile = useCallback(async () => {
    if (!user) { // Check if user is logged in
      setLoading(false); // Stop loading if no user
      return; // Exit function
    }

    try {
      const response = await api.get(endpoints.customerProfile); // Make API call to fetch profile
      console.log('Fetched profile:', response.data);
      // Set profile state with user data from response
      setProfile({ ...response.data.customer, email: response.data.email });
    } catch (err) {
      console.error('Error fetching profile:', err); // Log error
      setError('Failed to fetch profile. Please try again.'); // Set error message
    } finally {
      setLoading(false); // Stop loading regardless of success or error
    }
  }, [user]);

  // Call fetchProfile whenever the user changes
  useEffect(() => {
    fetchProfile(); // Fetch user profile data
  }, [fetchProfile]);

  // Function to update the user profile
  const updateProfile = async (formData) => {
    try {
      const response = await api.patch(endpoints.updateProfile, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type for form data
        },
      });
      return response; // Return response data
    } catch (error) {
      throw error; // Throw error to be handled later
    }
  };

  // Handle form submission for updating profile
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(''); // Clear previous error messages
    setUpdateSuccess(false); // Reset update success state
    setLoading(true); // Set loading state to true

    try {
      const formData = new FormData(); // Create new FormData object
      Object.keys(profile).forEach(key => {
        // Append non-null, non-undefined fields to FormData
        if (profile[key] !== null && profile[key] !== undefined) {
          formData.append(key, profile[key]);
        }
      });
      if (profilePicture) { // If a profile picture is selected
        formData.append('profile_picture', profilePicture); // Append profile picture to FormData
      }
      const response = await updateProfile(formData); // Call updateProfile with FormData
      setProfile(response.data); // Update profile state with response data
      setUpdateSuccess(true); // Set update success state
    } catch (err) {
      setError('Failed to update profile. Please try again.'); // Set error message on failure
    } finally {
      setLoading(false); // Stop loading regardless of success or error
    }
  };

  // Handle change in profile picture input
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setProfilePicture(file); // Set the profile picture state
      const reader = new FileReader(); // Create a FileReader to read the file
      reader.onloadend = () => {
        // Set profile picture data URL in profile state
        setProfile(prev => ({ ...prev, profile_picture: reader.result }));
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  // Handle input changes in profile form
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from event target
    // Update profile state with the new value
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Conditional rendering based on user authentication and loading states
  if (!user) return <Alert variant="warning">Please log in to view your profile.</Alert>; // Alert if user is not logged in
  if (loading) return <LoadingSpinner />; // Show loading spinner while loading data
  if (error) return <Alert variant="danger">{error}</Alert>; // Show error alert if there's an error
  if (!profile) return null; // Return null if no profile data is available


  return (
    <div className="user-profile-wrapper"> {/* Main container for styling */}
      <Form className="user-profile-form" onSubmit={handleSubmit}>
        {updateSuccess && <Alert variant="success">Profile updated successfully!</Alert>}
        
        <Row className="mb-3">
          <Col md={4} className="profile-picture">
            <Image src={profile.profile_picture || 'default-avatar.png'} roundedCircle fluid />
            <Form.Group controlId="formProfilePicture" className="mt-2">
              <Form.Label>Update Profile Picture</Form.Label>
              <Form.Control type="file" onChange={handleProfilePictureChange} accept="image/*" />
            </Form.Group>
          </Col>
          <Col md={8}>
            <Form.Group controlId="formBasicName" className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                name="name"
                value={profile.name || ''}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicNickname" className="mb-3">
              <Form.Label>Nickname</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter nickname"
                name="nickname"
                value={profile.nickname || ''}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicDateOfBirth" className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="date_of_birth"
                value={profile.date_of_birth || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="formBasicEmail" className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={profile.email || ''}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPhone" className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter phone number"
            name="phone_number"
            value={profile.phone_number || ''}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formBasicCity" className="mb-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city"
            name="city"
            value={profile.city || ''}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formBasicState" className="mb-3">
          <Form.Label>State</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter state"
            name="state"
            value={profile.state || ''}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formBasicCountry" className="mb-3">
          <Form.Label>Country</Form.Label>
          <Select
            options={countries}
            value={countries.filter(x => x.value === profile.country)}
            onChange={(e) => setProfile(prev => ({ ...prev, country: e.value }))}
          />
        </Form.Group>
        
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </Button>
      </Form>
    </div>
  );
}

export default UserProfile;
