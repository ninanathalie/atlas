import Image from "next/image";

interface LogoImageProps {
 letter: string;
 logoUrl?: string | null;
}

export function LogoImage({ letter, logoUrl }: LogoImageProps) {
 if (logoUrl) {
  return (
   <span className="size-8 md:size-10 rounded-full border shadow ring-2 ring-neutral-200 dark:ring-neutral-700 bg-neutral-100 dark:bg-neutral-800 flex-none overflow-hidden block">
    <Image src={logoUrl} alt="" width={40} height={40} className="size-full object-cover" />
   </span>
  );
 }

 return (
  <span className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-neutral-200 dark:ring-neutral-700 bg-neutral-100 dark:bg-neutral-800 flex-none flex items-center justify-center text-xs font-semibold text-neutral-500 dark:text-neutral-400">
   {letter}
  </span>
 );
}
