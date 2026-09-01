import API_BASE_URL from '../config/api'
import { useEffect, useState } from 'react'
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader
} from '@react-google-maps/api'
import './Profile.css'

const libraries = ['places']

const mapContainerStyle = {
  width: '100%',
  height: '400px'
}

const defaultCenter = {
  lat: 22.5726,
  lng: 88.3639
}

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [addressForm, setAddressForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })

  const [location, setLocation] = useState(defaultCenter)
  const [autocomplete, setAutocomplete] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setError('Please login first')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const data = await response.json()

        if (!response.ok) {
          setError(data.message || 'Failed to load profile')
          setLoading(false)
          return
        }

        setProfile(data)

        if (data.address) {
          setAddressForm({
            full_name: data.address.full_name || '',
            phone: data.address.phone || '',
            address: data.address.address || '',
            city: data.address.city || '',
            state: data.address.state || '',
            pincode: data.address.pincode || ''
          })

          if (
            data.address.latitude &&
            data.address.longitude
          ) {
            setLocation({
              lat: Number(data.address.latitude),
              lng: Number(data.address.longitude)
            })
          }
        }

        setLoading(false)
      } catch (error) {
        console.error(error)
        setError('Something went wrong')
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleInputChange = (event) => {
    const { name, value } = event.target

    setAddressForm((current) => ({
      ...current,
      [name]: value
    }))
  }

  const handlePlaceChanged = () => {
    if (!autocomplete) {
      return
    }

    const place = autocomplete.getPlace()

    if (!place.geometry || !place.geometry.location) {
      return
    }

    const lat = place.geometry.location.lat()
    const lng = place.geometry.location.lng()

    setLocation({
      lat,
      lng
    })

    let city = ''
    let state = ''
    let pincode = ''

    if (place.address_components) {
      place.address_components.forEach((component) => {
        const type = component.types[0]

        if (
          type === 'locality' ||
          type === 'administrative_area_level_2'
        ) {
          if (!city) {
            city = component.long_name
          }
        }

        if (type === 'administrative_area_level_1') {
          state = component.long_name
        }

        if (type === 'postal_code') {
          pincode = component.long_name
        }
      })
    }

    setAddressForm((current) => ({
      ...current,
      address: place.formatted_address || current.address,
      city: city || current.city,
      state: state || current.state,
      pincode: pincode || current.pincode
    }))
  }

  const handleMapClick = async (event) => {
    const lat = event.latLng.lat()
    const lng = event.latLng.lng()

    setLocation({
      lat,
      lng
    })

    if (!window.google) {
      return
    }

    const geocoder = new window.google.maps.Geocoder()

    geocoder.geocode(
      {
        location: {
          lat,
          lng
        }
      },
      (results, status) => {
        if (
          status === 'OK' &&
          results &&
          results.length > 0
        ) {
          const place = results[0]

          let city = ''
          let state = ''
          let pincode = ''

          place.address_components.forEach((component) => {
            const type = component.types[0]

            if (
              type === 'locality' ||
              type === 'administrative_area_level_2'
            ) {
              if (!city) {
                city = component.long_name
              }
            }

            if (type === 'administrative_area_level_1') {
              state = component.long_name
            }

            if (type === 'postal_code') {
              pincode = component.long_name
            }
          })

          setAddressForm((current) => ({
            ...current,
            address: place.formatted_address || '',
            city: city || '',
            state: state || '',
            pincode: pincode || ''
          }))
        }
      }
    )
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        setLocation({
          lat,
          lng
        })

        if (!window.google) {
          return
        }

        const geocoder = new window.google.maps.Geocoder()

        geocoder.geocode(
          {
            location: {
              lat,
              lng
            }
          },
          (results, status) => {
            if (
              status === 'OK' &&
              results &&
              results.length > 0
            ) {
              const place = results[0]

              let city = ''
              let state = ''
              let pincode = ''

              place.address_components.forEach((component) => {
                const type = component.types[0]

                if (
                  type === 'locality' ||
                  type === 'administrative_area_level_2'
                ) {
                  if (!city) {
                    city = component.long_name
                  }
                }

                if (type === 'administrative_area_level_1') {
                  state = component.long_name
                }

                if (type === 'postal_code') {
                  pincode = component.long_name
                }
              })

              setAddressForm((current) => ({
                ...current,
                address: place.formatted_address || '',
                city: city || '',
                state: state || '',
                pincode: pincode || ''
              }))
            }
          }
        )
      },
      (error) => {
        console.error(error)
        alert(
          'Unable to get your location. Please allow location permission.'
        )
      }
    )
  }

  const handleSaveAddress = async (event) => {
    event.preventDefault()

    const token = localStorage.getItem('token')

    if (!token) {
      alert('Please login first')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/profile/address`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...addressForm,
            latitude: location.lat,
            longitude: location.lng
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to save address')
        setSaving(false)
        return
      }

      setMessage('Address saved successfully')
      setSaving(false)

      setProfile((current) => ({
        ...current,
        address: {
          ...addressForm,
          latitude: location.lat,
          longitude: location.lng
        }
      }))
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
      setSaving(false)
    }
  }

  if (loading) {
    return <p>Loading profile...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!isLoaded) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p>Loading Google Maps...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">

      <div className="profile-container">

        <h1>My Profile</h1>

        <div className="profile-section">

          <h2>Personal Information</h2>

          <p>
            <strong>Name:</strong> {profile.user.name}
          </p>

          <p>
            <strong>Email:</strong> {profile.user.email}
          </p>

        </div>

        <div className="profile-section">

          <div className="address-heading">
            <h2>Delivery Address</h2>

            <button
              type="button"
              className="location-button"
              onClick={handleUseMyLocation}
            >
              📍 Use My Location
            </button>
          </div>

          <form onSubmit={handleSaveAddress}>

            <div className="address-form-grid">

              <div className="form-group">
                <label>Full Name</label>

                <input
                  type="text"
                  name="full_name"
                  value={addressForm.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  value={addressForm.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>

            </div>

            <div className="form-group">

              <label>Search Address</label>

              <Autocomplete
                onLoad={(autocompleteInstance) => {
                  setAutocomplete(autocompleteInstance)
                }}
                onPlaceChanged={handlePlaceChanged}
              >
                <input
                  type="text"
                  placeholder="Search your address"
                />
              </Autocomplete>

            </div>

            <div className="form-group">

              <label>Address</label>

              <input
                type="text"
                name="address"
                value={addressForm.address}
                onChange={handleInputChange}
                placeholder="Full address"
                required
              />

            </div>

            <div className="address-form-grid">

              <div className="form-group">
                <label>City</label>

                <input
                  type="text"
                  name="city"
                  value={addressForm.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  required
                />
              </div>

              <div className="form-group">
                <label>State</label>

                <input
                  type="text"
                  name="state"
                  value={addressForm.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  required
                />
              </div>

            </div>

            <div className="form-group">

              <label>Pincode</label>

              <input
                type="text"
                name="pincode"
                value={addressForm.pincode}
                onChange={handleInputChange}
                placeholder="Pincode"
                required
              />

            </div>

            <div className="map-section">

              <h3>Select Location</h3>

              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={location}
                zoom={15}
                onClick={handleMapClick}
              >
                <Marker position={location} />
              </GoogleMap>

              <p className="map-help">
                Search your address, use your current location,
                or click anywhere on the map to select a location.
              </p>

            </div>

            <button
              type="submit"
              className="save-address-button"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'SAVE ADDRESS'}
            </button>

            {message && (
              <p className="address-success">
                {message}
              </p>
            )}

          </form>

        </div>

      </div>

    </div>
  )
}

export default Profile