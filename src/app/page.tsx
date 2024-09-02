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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

const hexCodeSchema = z.object({
  hexCode: z.string().regex(/^[0-9a-fA-F]{6}$/, "Invalid hex code."),
});

type FormData = z.infer<typeof hexCodeSchema>;

type CloseToAnswer = "upward" | "downward";

interface ColorArray {
  singleHex: string;
  correct: boolean;
  closeToAnswer: CloseToAnswer;
}

export default function Home() {
  const [color, setColor] = useState<string>("#FFFFFF");
  const [userColor, setUserColor] = useState<string>("");
  const [colorArray, setColorArray] = useState<ColorArray[][]>();
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

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

  function checkHex(data: FormData): ColorArray[] {
    const userHex = data.hexCode.toUpperCase();
    const colorHex = color.toUpperCase().slice(1);
    const colorArray: ColorArray[] = [];
    for (let i = 0; i < 6; i++) {
      const singleHex = userHex.slice(i, i + 1);
      const correct = singleHex === colorHex.slice(i, i + 1);

      const userHexInt = parseInt(singleHex, 16);
      const colorHexInt = parseInt(colorHex.slice(i, i + 1), 16);

      const closeToAnswer: CloseToAnswer =
        userHexInt > colorHexInt ? "downward" : "upward";

      colorArray.push({ singleHex, correct, closeToAnswer });
    }
    return colorArray;
  }

  function resetGame() {
    setColor(getRandomHexColor());
    setColorArray([]);
    setIsCorrect(false);
    setIsGameOver(false);
    setUserColor("");
  }

  const onSubmit = (data: FormData) => {
    const results = checkHex(data);
    // add the array to the map state
    setColorArray((prev) => {
      //limit to 6 arrays, set isGameOver to true
      if (prev && prev.length >= 4) {
        setIsGameOver(true);
      }

      if (!prev) {
        return [results];
      }
      return [results, ...prev];
    });

    console.log(colorArray);
    setUserColor("#" + data.hexCode);

    if (results.every((color) => color.correct)) {
      setIsCorrect(true);
      setIsGameOver(true);
    }

    reset();
  };

  return (
    <>
      <main className="flex min-h-screen gap-8 flex-col items-center p-12">
        <h1 className="text-4xl font-bold">Color Hex Code Guesser</h1>
        <div className="flex flex-row gap-8">
          <div
            className="size-36 sm:size-48 md:size-64 flex items-center justify-center border"
            style={{ backgroundColor: color }}
          ></div>
          {/* user color box */}
          <div
            className="size-36 sm:size-48 md:size-64 flex items-center justify-center border"
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

            <Button type="submit" disabled={isGameOver}>
              Submit
            </Button>
          </form>
        </Form>

        {isCorrect && isGameOver && (
          <div className=" text-green-600 p-4 rounded-md">
            You guessed the color!
          </div>
        )}

        {isGameOver && !isCorrect && (
          <div className=" text-red-600 p-4 rounded-md">
            You didn&#39;t guess the color!
          </div>
        )}

        {isGameOver && (
          <Button onClick={resetGame} className="-mt-4">
            Restart
          </Button>
        )}

        <div className="flex flex-col gap-4 px-3">
          {colorArray?.map((colorArray, index) => (
            <div key={index} className="flex flex-row space-x-4">
              {colorArray.map((color, index) => (
                <div
                  key={index}
                  className={cn(
                    "size-10 md:size-12 rounded-md flex items-center justify-center border",
                    color.correct ? "bg-green-600" : "bg-red-600"
                  )}
                >
                  {!color.correct ? (
                    color.closeToAnswer === "upward" ? (
                      <ArrowUp size={18} />
                    ) : (
                      <ArrowDown size={18} />
                    )
                  ) : (
                    ""
                  )}
                  {color.singleHex}
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
      <footer className="-mt-14">
        <div
          className="
          text-sm text-gray-500 py-4 text-center
          "
        >
          Made with ❤️ by Dipesh
        </div>
      </footer>
    </>
  );
}
