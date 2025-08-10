import {
  AccessibilityIcon,
  AdvancedIcon,
  CollaboratorsIcon,
  LocationIcon,
} from "../../utils/svg";

export default function AdditionalOptions() {
  return (
    <div className="flex flex-col">
      {/* Add Location */}
      <button className="flex items-center justify-between p-4 border-b">
        <span className="text-base text-gray-600">Add location</span>
        <LocationIcon />
      </button>
      {/* Add Collaborators */}
      <button className="flex items-center justify-between p-4 border-b">
        <span className="text-base text-gray-600">Add collaborators</span>
        <CollaboratorsIcon />
      </button>
      {/* Accessibility */}
      <button className="flex items-center justify-between p-4 border-b">
        <span className="text-base text-gray-600">Accessibility</span>
        <AccessibilityIcon />
      </button>
      {/* Advanced Settings */}
      <button className="flex items-center justify-between p-4 border-b">
        <span className="text-base text-gray-600">Advanced settings</span>
        <AdvancedIcon />
      </button>
    </div>
  );
}
