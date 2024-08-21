"use client"
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getRandomHexColor } from "@/lib/helpers";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const hexCodeSchema = z.object({
  hexCode: z
    .string()
    .regex(/^[0-9a-fA-F]{6}$/, 'Invalid hex code.')
});

type FormData = z.infer<typeof hexCodeSchema>;

export default function Home() {
  const [color, setColor] = useState<string>('#FFFFFF');

  const form = useForm<FormData>({
    resolver: zodResolver(hexCodeSchema),
    defaultValues: {
      hexCode: ''
    }
  });

  useEffect(() => {
    setColor(getRandomHexColor());
  }, []);

  function handleClick(){
    setColor(getRandomHexColor());
  }

  function checkHex(data:FormData){
    const userHex = data.hexCode.toLowerCase();
    const results = color.split('').map((char, index) => {
      const userChar = userHex[index];
      if (userChar === char) {
        return { status: 'correct', char: userChar };
      } else if (userChar < char) {
        return { status: 'less', char: userChar };
      } else {
        return { status: 'more', char: userChar };
      }
    });
  }

  const onSubmit = (data: FormData) => {
    checkHex(data);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button onClick={handleClick}>Click</Button>
      <div className="size-64 flex items-center justify-center" style={{ backgroundColor: color }}>
      </div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row space-x-4 items-end">
        <FormField
          control={form.control}
          name="hexCode"
          render={({ field }) => (
            <FormItem className="flex flex-col space-x-2 items-end">
              <div className="flex space-x-2 items-end">

              <FormLabel className="text-3xl">#</FormLabel>
              <FormControl>
                <Input placeholder="enter you guess" {...field} />
              </FormControl>
              </div>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>

    </main>
  );
}
