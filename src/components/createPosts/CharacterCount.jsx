import { EmojiIcon } from "../../utils/svg";

export default function CharacterCount({ caption }) {
  const safeCaption = caption ?? "";
  return (
    <div className="flex justify-between items-center">
      <button className="text-gray-400">
        <EmojiIcon />
      </button>
      <span className="text-gray-400 text-xs">{safeCaption.length}/500</span>
    </div>
  );
}
