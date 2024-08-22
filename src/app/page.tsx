"use client";
import { Button } from "@/components/ui/button";
import { use, useEffect, useState } from "react";
import { getRandomHexColor } from "@/lib/helpers";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const hexCodeSchema = z.object({
  hexCode: z.string().regex(/^[0-9a-fA-F]{6}$/, "Invalid hex code."),
});

type FormData = z.infer<typeof hexCodeSchema>;

interface ColorArray {
  singleHex: string;
  correct: boolean;
}

export default function Home() {
  const [color, setColor] = useState<string>("#FFFFFF");
  const [userColor, setUserColor] = useState<string>("");
  const [colorArray, setColorArray] = useState<ColorArray[][]>();

  const form = useForm<FormData>({
    resolver: zodResolver(hexCodeSchema),
    defaultValues: {
      hexCode: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    setColor(getRandomHexColor());
  }, []);

  function checkHex(data: FormData):ColorArray[] {
    const userHex = data.hexCode.toLowerCase();
    const colorHex = color.toLowerCase().slice(1);
    const colorArray:ColorArray[] = [];
    for (let i = 0; i < 6; i++) {
      const singleHex = userHex.slice(i, i + 1);
      const correct = singleHex === colorHex.slice(i, i + 1);
      colorArray.push({ singleHex, correct });
    }
    return colorArray;
  }

  const onSubmit = (data: FormData) => {
    const results = checkHex(data);
    // add the array to the map state
    setColorArray((prev) => {
      if (!prev) {
        return [results];
      }
      return [...prev, results];
    });

    console.log(colorArray);
    setUserColor("#" + data.hexCode);
    reset();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-row gap-8">
        <div
          className="size-64 flex items-center justify-center border"
          style={{ backgroundColor: color }}
        ></div>
        {/* user color box */}
        <div
          className="size-64 flex items-center justify-center border"
          style={{ backgroundColor: userColor }}
        ></div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row space-x-4 items-end"
        >
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  );
}
