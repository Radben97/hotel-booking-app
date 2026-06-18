import { useFormContext } from "react-hook-form";
import { hotelFormData } from "./ManageHotelForm";
import { useEffect } from "react";

const ImagesSection = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<hotelFormData>();
  let existingimageurls = watch("imageURLs");
  useEffect(() => {}, [existingimageurls]);
  console.log("Existing image urls", existingimageurls);
  const deleteImg = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageUrl: string,
  ) => {
    e.preventDefault();
    setValue(
      "imageURLs",
      existingimageurls.filter((url) => url !== imageUrl),
      { shouldDirty: true, shouldTouch: true },
    );
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3 py-4">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        {existingimageurls && (
          <div className="grid grid-cols-6 gap-5">
            {existingimageurls.map((imageUrl) => {
              return (
                <div className="relative group" key={imageUrl}>
                  <img
                    src={imageUrl}
                    alt="hotel images"
                    className="min-h-full object-cover"
                  />
                  <button
                    className="text-white absolute inset-0 flex items-center justify-center opacity-0 bg-black bg-opacity-50 group-hover:opacity-100 "
                    onClick={(e) => deleteImg(e, imageUrl)}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          className="font-normal text-gray-700 w-full"
          {...register("imageFiles", {
            validate: (imageFiles) => {
              if (imageFiles.length === 0 && existingimageurls.length === 0) {
                return "Upload atleast one image";
              }
              if (imageFiles?.length + existingimageurls.length > 6) {
                return "You can upload atmost 6 images";
              }
              return true;
            },
          })}
        />
        {errors.imageFiles && (
          <span className="text-red-500 text-sm font-bold">
            {errors.imageFiles.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default ImagesSection;
