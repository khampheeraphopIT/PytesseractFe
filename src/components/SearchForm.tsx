import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button, CircularProgress, TextField, Typography } from '@mui/material'
import { SearchOutlined } from '@mui/icons-material'
import type { ISearchForm } from '../type/SearchForm'
import type { SearchRequest } from '../type/SearchRequest'

interface SearchFormProps {
  setSearchResults: React.Dispatch<React.SetStateAction<ISearchForm[]>>
}

const SearchForm: React.FC<SearchFormProps> = ({ setSearchResults }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<SearchRequest>({
    defaultValues: {
      query: '',
      min_score: 0.1,
    },
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  const onSubmit = async (data: SearchRequest) => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/v1/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const results = await response.json()
      if (response.ok) {
        setSearchResults(results)
        setMessage(results.length === 0 ? 'No results found' : '')
      } else {
        setMessage(`Error: ${results.detail || 'Failed to search'}`)
        setSearchResults([])
      }
    } catch (error) {
      setMessage('Error searching documents')
      setSearchResults([])
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="query"
        control={control}
        rules={{ required: 'Search query is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Search Query"
            placeholder="Enter search"
            fullWidth
            error={!!errors.query}
            helperText={errors.query?.message}
            margin="normal"
          />
        )}
      />
      <Controller
        name="min_score"
        control={control}
        rules={{
          min: { value: 0, message: 'Minimum score must be at least 0' },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            type="number"
            label="Minimum Score"
            inputProps={{ step: '0.01', min: 0 }}
            fullWidth
            error={!!errors.min_score}
            helperText={errors.min_score?.message}
            margin="normal"
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        )}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        startIcon={<SearchOutlined />}
        disabled={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Search'}
      </Button>
      {message && (
        <Typography
          variant="body2"
          color={message.includes('Error') ? 'error' : 'text.secondary'}
          sx={{ mt: 1 }}
        >
          {message}
        </Typography>
      )}
    </form>
  )
}

export default SearchForm