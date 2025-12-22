export const APP_CONSTANTS = {
  REGEX: {
    TRACKING_ID: /^DHL\d{6}$/,
    LETTERS_SPACES_HYPHENS: /^[a-zA-Z\s\-]*$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },

  VALIDATION_MESSAGES: {
    TRACKING_ID: {
      REQUIRED: 'Tracking ID is required',
      INVALID_FORMAT:
        'Invalid Tracking ID format. Expected: DHL followed by 6 digits (e.g., DHL905514)',
    },

    ORIGIN: {
      REQUIRED: 'Origin is required',
      MIN_LENGTH: 'Origin must be at least 2 characters',
      MAX_LENGTH: 'Origin cannot exceed 100 characters',
      INVALID_CHARACTERS: 'Origin can only contain letters, spaces, and hyphens',
      INVALID: 'Invalid origin',
    },

    DESTINATION: {
      REQUIRED: 'Destination is required',
      MIN_LENGTH: 'Destination must be at least 2 characters',
      MAX_LENGTH: 'Destination cannot exceed 100 characters',
      INVALID_CHARACTERS: 'Destination can only contain letters, spaces, and hyphens',
      INVALID: 'Invalid destination',
    },

    DATE: {
      REQUIRED: 'Date is required',
      FUTURE_DATE: 'Date must be in the future',
      INVALID: 'Invalid date',
    },

    LOCATION: {
      REQUIRED: 'Location is required',
      MIN_LENGTH: 'Location must be at least 2 characters',
      MAX_LENGTH: 'Location cannot exceed 100 characters',
      INVALID_CHARACTERS: 'Location can only contain letters, spaces, and hyphens',
      INVALID: 'Invalid location',
    },

    STATUS: {
      REQUIRED: 'Status is required',
      INVALID: 'Please select a valid shipment status',
    },

    EMAIL: {
      REQUIRED: 'Email is required',
      INVALID_FORMAT: 'Please enter a valid email address',
      INVALID: 'Invalid email',
    },

    PASSWORD: {
      REQUIRED: 'Password is required',
      MIN_LENGTH: 'Password must be at least 6 characters',
      INVALID: 'Invalid password',
    },
  },

  ERROR_MESSAGES: {
    SOMETHING_WENT_WRONG: 'Something went wrong',
    GENERIC_ERROR: 'Something went wrong. Please try again.',
    SHIPMENT_CREATED_SUCCESS: 'Shipment created successfully',
    SHIPMENT_UPDATED_SUCCESS: 'Shipment updated successfully',
    FAILED_TO_UPDATE: 'Failed to update shipment',
    INVALID_TRACKING_ID: 'Invalid tracking ID',
    ALL_FIELDS_REQUIRED: 'All fields are required and must be valid',
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    LOGOUT_SUCCESS: 'Logged out successfully',
  },

  UI_LABELS: {
    TRACKING_ID_PLACEHOLDER: 'Tracking ID (e.g., DHL905514)',
    TRACKING_ID_FORMAT_HELP: 'Format: DHL followed by 6 digits, e.g., DHL905514',
    ORIGIN_PLACEHOLDER: 'Origin',
    ORIGIN_HELP: 'Enter the pickup location for the shipment. Minimum 3 characters required.',
    DESTINATION_PLACEHOLDER: 'Destination',
    DESTINATION_HELP:
      'Enter the delivery location for the shipment. Minimum 3 characters required.',
    LOCATION_PLACEHOLDER: 'e.g., New York, Chicago, Los Angeles',
    LOCATION_HELP: 'Enter the current location of the shipment. Minimum 3 characters required.',
    LOCATION_MIN_CHARS_ERROR: 'Location must be at least 3 characters',
    STATUS_PLACEHOLDER: '-- Select Status --',
    DATE_FORMAT_HELP: 'Select the expected delivery date for this shipment.',
    EMAIL_PLACEHOLDER: 'Email',
    EMAIL_HELP: 'Enter your email address for account authentication.',
    PASSWORD_PLACEHOLDER: 'Password',
    PASSWORD_HELP: 'Enter your password. Password must be at least 6 characters.',

    PAGE_HEADERS: {
      LOGIN: 'Login',
      TRACK_SHIPMENT: 'Track Shipment',
      CREATE_SHIPMENT: 'Create Shipment',
      UPDATE_SHIPMENT: 'Update Shipment Status',
    },

    PAGE_DESCRIPTIONS: {
      TRACK_SHIPMENT_DESC: 'Enter your tracking ID to view shipment status and history',
      CREATE_SHIPMENT_DESC: 'Admin-only shipment creation',
      UPDATE_SHIPMENT_DESC: 'Update the shipment status and location to add a new milestone',
    },

    BUTTON_LABELS: {
      LOGIN: 'Login',
      LOGGING_IN: 'Logging in…',
      LOGOUT: 'Logout',
      TRACK: 'Track',
      CREATE_SHIPMENT: 'Create Shipment',
      CREATING_SHIPMENT: 'Creating Shipment…',
      UPDATE_SHIPMENT: 'Update Shipment',
      UPDATING: 'Updating...',
      UPDATE_STATUS: 'Update Status',
    },

    FORM_LABELS: {
      TRACKING_ID: 'Tracking ID',
      STATUS: 'New Status',
      LOCATION: 'Current Location',
      ORIGIN: 'Origin',
      DESTINATION: 'Destination',
      ESTIMATED_DELIVERY_DATE: 'Estimated Delivery Date',
      EMAIL: 'Email',
      PASSWORD: 'Password',
      SELECT_STATUS: '-- Select Status --',
    },

    ARIA_LABELS: {
      USER_LOGIN_FORM: 'User login form',
      EMAIL_ADDRESS: 'Email address',
      PASSWORD_FIELD: 'Password',
      LOGIN_BUTTON: 'Login to your account',
      TRACKING_ID_INPUT: 'Tracking ID input field',
      SEARCH_TRACKING: 'Search for shipment tracking information',
      SHIPMENT_DETAILS: 'Shipment details',
      SHIPMENT_MILESTONES: 'Shipment milestones and delivery history',
      CREATE_SHIPMENT_FORM: 'Create new shipment form',
      SHIPMENT_ORIGIN: 'Shipment origin location',
      SHIPMENT_DESTINATION: 'Shipment destination location',
      ESTIMATED_DELIVERY_DATE: 'Estimated delivery date',
      UPDATE_SHIPMENT_FORM: 'Update shipment status form',
      CURRENT_STATUS: 'Current shipment status',
      SELECT_SHIPMENT_STATUS: 'Select new shipment status',
      CURRENT_LOCATION: 'Current shipment location',
      TRACKING_ID_READONLY: 'Tracking ID (read-only)',
      REQUIRED_FIELD: 'required',
      DHL_LOGO: 'DHL logo',
      APPLICATION_NAME: 'Application name',
      APPLICATION_DESCRIPTION: 'Application description',
      MAIN_NAVIGATION: 'Main navigation',
      TRACK_SHIPMENT_LINK: 'Track shipment - Go to tracking page',
      CREATE_SHIPMENT_LINK: 'Create shipment - Admin only',
      LOGIN_LINK: 'Go to login page',
      LOGOUT_BUTTON: 'Logout from your account',
      UPDATE_FOR_SHIPMENT: 'Update status for shipment',
      COPYRIGHT_NOTICE: 'Copyright notice',
      LOADING_INDICATOR: 'Loading content',
    },

    STATUS_INDICATORS: {
      CURRENT_STATUS: 'Current Status:',
    },

    DROPDOWN_LABELS: {
      NO_RESULTS: 'No shipments found',
      LOADING_SHIPMENTS: 'Loading shipments...',
      SEARCH_PLACEHOLDER: 'Search or select tracking ID',
      ADMIN_ONLY_FEATURE: 'This feature is available for admin users only',
      SELECT_SHIPMENT: 'Select a shipment from the list',
    },

    HELP_TEXT: {
      PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
      ORIGIN_HELP: 'Enter the pickup location for the shipment. Minimum 2 characters required.',
      DESTINATION_HELP:
        'Enter the delivery location for the shipment. Minimum 2 characters required.',
      LOCATION_HELP: 'Enter the current location of the shipment. Minimum 2 characters required.',
      DATE_HELP: 'Select the expected delivery date for this shipment.',
      MILESTONE_NOTE:
        'This update will add a new milestone to the shipment history with the current timestamp.',
    },

    HEADERS: {
      DHL: 'DHL',
      DHL_LOGO: 'DHL logo',
      SHIPMENT_TRACKING: 'Shipment Tracking',
      ADMIN_CUSTOMER_PORTAL: 'Admin & Customer Portal',
      FOOTER_COPYRIGHT: '© 2025 DHL Shipment Tracking System · Internal Application',
    },
  },
} as const;
