import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "./ui/form"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { useState } from "react"
import { toast } from "sonner"
import { Sparkles, Camera, Tag, Calculator, Lock, Unlock, Coins } from "lucide-react"
import { Card, CardHeader, CardContent } from "./ui/card"

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
      ImageUrl: "",
      InitialSupply: 1000,
      Symbol: "",
      Decimal: 9,
      RevokeMint: false,
      RevokeFreeze: false
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
    <Card className="border-border shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 p-6 border-b border-border/50">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="h-6 w-6 text-white" />
          <h1 className="text-2xl font-bold text-white">Create Your Token</h1>
        </div>
        <p className="text-center text-white/80 mt-2">Launch your own token on Solana blockchain</p>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="TokenName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium flex items-center gap-2">
                        <Coins className="h-4 w-4" />
                        Token Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., My Awesome Token" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Symbol
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., MAT" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="InitialSupply"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Initial Supply
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 1000000"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="ImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Image URL
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>Use a square image for best results</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Decimal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Decimals
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 9"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>Standard is 9 decimals for Solana</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-4 pt-2">
                  <FormField
                    control={form.control}
                    name="RevokeMint"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Revoke Mint Authority
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Prevents creating more tokens in the future
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="RevokeFreeze"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium flex items-center gap-2">
                            <Unlock className="h-4 w-4" />
                            Revoke Freeze Authority
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Prevents freezing holders' token accounts
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity text-white dark:text-white font-semibold"
                variant="default"
                size="lg"
                disabled={isSubmitting || !publicKey}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Creating Token...</span>
                  </div>
                ) : (
                  <span>Launch Token</span>
                )}
              </Button>

              {!publicKey && (
                <p className="text-center mt-3 text-amber-500 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-900/20 p-2 rounded-md text-sm">
                  Please connect your wallet to create a token
                </p>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default TokenLaunchpadForm
