import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";

interface TopPerformerItem {
  id: string;
  image: { url: string }[];
  name: string;
  trips_booked: number;
  email: string;
}

interface TripProps {
  data?: TopPerformerItem[];
}

const Trip = ({ data }: TripProps) => {
  if (!data?.length) {
    return (
      <p className="text-grey-400 text-sm text-center py-6">No Trips yet</p>
    );
  }

  return (
    <div className="flex flex-col gap-10 divide-y-2 divide-grey-100 mt-5">
      {data?.slice(0, 5).map((item) => (
        <div key={item.id} className="flex justify-between items-center pb-3">
          <div className="flex gap-2 items-center">
            <Avatar>
              <AvatarImage src={item?.image?.[0]?.url} alt={item.name || ""} />
              <AvatarFallback>
                {item.name ? item.name.charAt(0) : "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-bold text-sm text-grey-600">{item.name}</div>
              <div className="text-grey-600 text-sm">{item.email}</div>
            </div>
          </div>
          <p className="text-grey-800 text-xl">{item.trips_booked} trips</p>
        </div>
      ))}
    </div>
  );
};

export default Trip;
