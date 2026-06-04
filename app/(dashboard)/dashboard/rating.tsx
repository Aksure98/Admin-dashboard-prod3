import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";

interface TopPerformerItem {
  operator_id: string;
  image: { url: string }[];
  name: string;
  avg_rating: number;
  email: string;
  trips_booked: number;
}

interface RatingProps {
  data?: TopPerformerItem[];
}

const Rating = ({ data }: RatingProps) => {
  if (!data?.length) {
    return (
      <p className="text-grey-400 text-sm text-center py-6">No rating yet</p>
    );
  }

  return (
    <div className="flex flex-col gap-10 divide-y-2 divide-grey-100 mt-5">
      {data?.slice(0, 5).map((rating) => (
        <div
          key={rating.operator_id}
          className="flex justify-between items-center pb-3"
        >
          <div className="flex gap-2 items-center">
            <Avatar>
              <AvatarImage
                src={rating?.image?.[0]?.url}
                alt={rating.name || ""}
              />
              <AvatarFallback>
                {rating.name ? rating.name.charAt(0) : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="font-bold text-sm text-grey-600">
                {rating.name}
              </div>
              <div className="text-grey-600 text-sm">{rating.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= Number(rating.avg_rating)
                    ? "text-warning-500"
                    : "text-grey-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-sm text-grey-600">
              {rating.avg_rating}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Rating;
