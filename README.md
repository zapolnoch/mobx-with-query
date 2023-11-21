# WithQuery

It makes fetching and updating server state in your MobX-store a breeze.

## Usage

```ts
import { WithQuery } from "mobx-with-query"

class Store {
  constructor() {
    makeAutoObservable(this)
  }

  data = new WithQuery(() =>
    fetch("https://api.github.com/repos/tannerlinsley/react-query"),
  )
}
```

In your React-component:

```tsx
const Page = observer(() => {
  const [store] = useState(() => new Store())
  const { isLoading, data, error } = store.data

  if (isLoading) return "Loading..."

  if (error) return "An error has occurred: " + error.message

  return <div>{data.name}</div>
})
```

## Config

The `onError` and `onSuccess` can be used to handle these events:

```ts
class Store {
  data = new WithQuery(Api.getMethod, {
    onError: () => alert("Server Error. Please try again later"),
    onSuccess: () => alert("Completed successfully"),
  })
}
```

You can disable automatic data loading using `loadOnMount`. In addition, you can transform the response using mapping:

```tsx
class Store {
  project = new WithQuery(Api.getProject, {
    loadOnMount: false,
    transform: (data) => data?.name.toUpperCase(),
  })
}

const Page = observer(() => {
  const [store] = useState(() => new Store())
  const { id } = useParams()

  useEffect(() => {
    project.load(id)
  }, [id])
})
```
