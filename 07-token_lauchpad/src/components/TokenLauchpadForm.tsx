import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "./ui/form"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { useState } from "react"
import { toast } from "sonner"

import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import createToken from "@/utils/createToken"

const formSchema = z.object({
  TokenName: z.string().min(2).max(20),
  ImageUrl: z.string().url(),
  InitialSupply: z.number().positive(),
  Symbol: z.string().min(2).max(8),
  Decimal: z.number().min(0).max(18),
  RevokeMint: z.boolean(),
  RevokeFreeze: z.boolean()
})

export type FormSchema = z.infer<typeof formSchema>

const TokenLaunchpadForm = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      TokenName: "",
      ImageUrl: "https://i.pinimg.com/736x/62/1e/24/621e24e8eb8793377614abb4081975d5.jpg",
      InitialSupply: 1000,
      Symbol: "",
      Decimal: 9,
      RevokeMint: false, // No one will be able to mint more tokens anymore
      RevokeFreeze: false // No one will be able to freeze holders' token accounts anymore
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!publicKey) {
      toast.error("Please connect your wallet first")
      return
    }

    setIsSubmitting(true)
    try {
      await createToken(connection, publicKey, values, sendTransaction)
      toast.success("Token created successfully!")
      form.reset()
    } catch (error) {
      console.error("Error creating token:", error)
      toast.error("Failed to create token. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-lg shadow-md dark:shadow-amber-50">
      <h1 className="text-2xl font-bold mb-6 text-center">Token Launchpad Form</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="TokenName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Token Name</FormLabel>
                <FormControl>
                  <Input placeholder="Token Name" className="w-full" {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="Image URL" className="w-full" {...field} />
                </FormControl>
                <FormDescription>Try to add a square image</FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Symbol</FormLabel>
                <FormControl>
                  <Input placeholder="Symbol" className="w-full" {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="InitialSupply"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Initial Supply</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Initial Supply"
                    className="w-full"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Decimal"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Decimals</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Decimals"
                    className="w-full"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="RevokeMint"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-0.5">
                  <FormLabel>Revoke Mint</FormLabel>
                  <FormDescription>
                    No one will be able to mint more tokens anymore.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="RevokeFreeze"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-0.5">
                  <FormLabel>Revoke Freeze</FormLabel>
                  <FormDescription>
                    No one will be able to freeze holders' token accounts anymore.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
            disabled={isSubmitting || !publicKey}
          >
            {isSubmitting ? "Creating Token..." : "Submit"}
          </Button>
          {!publicKey && (
            <p className="text-center text-sm text-amber-500">Please connect your wallet to create a token</p>
          )}
        </form>
      </Form>
    </div>
  )
}

export default TokenLaunchpadForm 
