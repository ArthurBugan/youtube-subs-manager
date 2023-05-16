import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"
import { useController, useFormContext } from "react-hook-form"
import { GroupedVirtuoso } from "react-virtuoso"

import { Button } from "~components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "~components/ui/command"
import {
  DynamicIcon,
  type Library,
  LibraryIcons,
  returnLibraryIcons
} from "~components/ui/icon"
import { Popover, PopoverContent, PopoverTrigger } from "~components/ui/popover"
import { cn } from "~lib/utils"

interface ComboboxProps {
  className: string
  name: string
}

const ComboboxDemo: React.FC<ComboboxProps> = ({ name, className }) => {
  const [open, setOpen] = React.useState(false)
  const formContext = useFormContext()

  const groups = React.useMemo(() => {
    return Object.keys(LibraryIcons).map((framework) => framework)
  }, [])

  const groupsCount = React.useMemo(() => {
    return Object.keys(LibraryIcons).map(
      (framework) =>
        Object.keys(returnLibraryIcons(framework as Library)).length
    )
  }, [])

  const items = React.useMemo(() => {
    return Object.keys(LibraryIcons)
      .map((framework) => Object.keys(returnLibraryIcons(framework as Library)))
      .flat()
  }, [])

  const {
    field,
    fieldState: { invalid, isTouched, isDirty, error },
    formState: { isSubmitting }
  } = useController({ name })

  if (!formContext || !name) {
    const msg = !formContext
      ? "ComboBox must be wrapped by the FormProvider"
      : "Name must be defined"
    console.error(msg)
    return null
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={className} asChild>
        <Button
          variant="outline"
          size={"lg"}
          role="combobox"
          aria-expanded={open}
          className="justify-between text-primary w-full text-xl">
          {field.value ? (
            <p className="flex flex-row items-center justify-center">
              <span className="hidden">{field.value}</span>
              <DynamicIcon
                lib={field.value.slice(0, 2).toLowerCase()}
                icon={field.value}
              />
            </p>
          ) : (
            "Icon..."
          )}
          <ChevronsUpDown className="ml-2 h-6 w-6 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[290px] p-0 bg-primary">
        <Command className="w-full">
          <CommandInput placeholder="Search icon..." />
          <CommandEmpty>No icon found.</CommandEmpty>

          <CommandGroup>
            <GroupedVirtuoso
              groupCounts={groupsCount}
              className="virtuoso-scroller"
              overscan={1000}
              groupContent={(index) => <div>{index}</div>}
              itemContent={(index) => {
                console.log(
                  "itemContent",
                  items[index],
                  items[index].slice(0, 2)
                )

                return (
                  <CommandItem
                    className="w-full justify-center items-center"
                    key={items[index]}
                    title={items[index]}
                    value={items[index]}
                    onSelect={() => {
                      console.log(items[index])
                      field.onChange(items[index])
                      setOpen(false)
                    }}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        field.value === items[index]
                          ? "opacity-100"
                          : "hidden opacity-0"
                      )}
                    />
                    <DynamicIcon
                      lib={items[index].slice(0, 2).toLowerCase() as Library}
                      className="text-primary"
                      icon={items[index]}
                    />
                  </CommandItem>
                )
              }}
            />
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default ComboboxDemo
